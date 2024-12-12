class ValidationError {
    target!: object;
    property!: string;
    value!: string;
    children!: any;
    constraints!: object;
}

export default class ValidationErrorList {
    errors: Array<ValidationError> = [];

    addError(
        target: object,
        property: string,
        value: any,
        constraints: any
    ) {
        this.errors.push({
            target: target,
            value: value,
            property: property,
            children: [],
            constraints: constraints,
        });
    }
}
