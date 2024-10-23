import { support } from "./node.support";

const get = (path: string, obj: Record<string, any>) => {
    const info = support.validatePath(path, obj);
    if (info.lastValues.length > 1) {
        throw new Error(`The last path expect a single value.`);
    }

    if (info.Navigation.length === 1) {
        return obj[info.firstPath];
    }

    let current: any = obj;
    for (let i = 0; i < info.Navigation.length - 1; i++) {
        const key = info.Navigation[i];
        if (current[key] === undefined) {
            return undefined;
        }
        current = current[key];
    }

    const lastKey = info.lastPath[0];
    if (current[lastKey] === undefined) {
        return undefined;
    }
    return current[lastKey];


};

const set = (path: string, { value, data }: { value: any, data: object }) => {
    const info = support.validatePath(path, data);
    const isArrayValue = info.lastValues.length > 1;
    let newData: any = !isNaN(Number(info.firstPath)) ? [] : { ...data };

    if (info.Navigation.length === 1) {
        newData[info.firstPath] = value;
        return newData; // Devolvemos el objeto actualizado
    }

    if (!Array.isArray(value) && info.lastValues.length > 1) {
        throw new Error(`The value expects an Array with ${info.lastValues.length} values.`);
    }

    let current: any = newData;
    let parent: any = current;
    let lastKey: any = null;

    for (let i = 0; i < info.Navigation.length; i++) {
        const key = info.Navigation[i];
        const isArrayIndex = !isNaN(Number(key));

        if (i === info.Navigation.length - 1) {
            lastKey = key;
            break;
        }

        if (isArrayIndex) {
            if (!Array.isArray(current[key])) {
                current[key] = [];
            }
        } else {
            if (current[key] === undefined) {
                current[key] = {};
            }
        }

        parent = current;
        current = current[key];
    }

    if (isArrayValue) {
        if (!Array.isArray(value)) {
            throw new Error('The value must be an array when assigning to multiple keys.');
        }

        // Asignamos cada valor del array a la clave correspondiente
        const keys = info.lastValues;
        if (keys.length !== value.length) {
            throw new Error(`The number of keys (${keys.length}) does not match the number of values (${value.length}).`);
        }

        keys.forEach((key: string, index: number) => {
            parent[key] = value[index]; // Asigna el valor correspondiente a cada clave
        });
    } else {
        // Si solo es una clave, asignamos el valor directamente
        const isLastArrayIndex = !isNaN(Number(lastKey));
        if (isLastArrayIndex) {
            current[Number(lastKey)] = value;
        } else {
            parent[lastKey] = value;
        }
    }

    return newData;
};

const remove = (path: string, obj: Record<string, any>): Record<string, any> => {
    const info = support.validatePath(path, obj);

    // Si solo hay un nodo en la navegación, simplemente eliminamos ese nodo
    if (info.Navigation.length === 1) {
        // Retorna un objeto vacío, eliminando el primer nivel
        const { [info.firstPath]: _, ...remaining } = obj; // Desestructuramos para eliminar la clave
        return remaining; // Devuelve el objeto actualizado
    }

    let current: any = obj;
    let parent: any = null; // Mantener una referencia al objeto padre
    let lastKey: string | null = null;

    // Navegar hasta el penúltimo nodo
    for (let i = 0; i < info.Navigation.length; i++) {
        const key = info.Navigation[i];

        // Almacenar el nodo padre y la última clave
        parent = current;
        lastKey = key;

        // Mover al siguiente nivel
        current = current[key];

        // Si llegamos a un nodo que no existe, no podemos continuar
        if (current === undefined) {
            console.log('No existe');
            return obj; // Devuelve el objeto original si la ruta no existe
        }
    }

    // Si llegamos a este punto, `current` es el último nodo
    // Eliminamos la clave del objeto padre
    if (lastKey && parent) {
        delete parent[lastKey];
    }

    return obj; // Devuelve el objeto actualizado
};

const sayHello = () => {
    console.log('hi')
}
const sayGoodbye = () => {
    console.log('goodbye')
}

export const node = {
    get,
    set,
    remove,
    sayHello,
    sayGoodbye
};
