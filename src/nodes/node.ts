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
        if (!current[key]) {
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
    if (value === data) {
        throw new Error('The value and data cannot be the same.');
    }

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

    for (let i = 0; i < info.Navigation.length; i++) {
        const key = info.Navigation[i];

        if (i === info.Navigation.length - 1) {
            if (!Array.isArray(value) && isArrayValue) {
                throw new Error('The value must be an array when assigning to multiple keys.');
            }

            if (info.lastValues.length === 1) {
                current[key] = value
                break;
            }
            parent = current
            const keys = info.lastValues;
            keys.forEach((keyIn: string, index: number) => {
                parent[keyIn] = value[index];
            });
            return newData;
        }

        if (current[key] === undefined) {
            current[key] = {};
        }

        parent = current;
        current = current[key];
    }

    return newData;
};

const remove = (path: string, obj: Record<string, any>): Record<string, any> => {
    const info = support.validatePath(path, obj);
    let newData: any = { ...obj };

    if (info.Navigation.length === 1) {
        const { [info.firstPath]: _, ...remaining } = obj;
        return remaining; 
    }

    let current: any = obj;

    // Navegar hasta el penúltimo nodo
    for (let i = 0; i < info.Navigation.length; i++) {
        const key = info.Navigation[i];
        
        if (!current[key]) {
            console.log('No existe');
            return obj;
        }

        if(i === info.Navigation.length - 1){
            delete current[key];
            break;
        }
        
        current = current[key];
    }

    return newData;
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
