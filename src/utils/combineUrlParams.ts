interface IParams {
    parent?: string | null | undefined;
    sort?: string;
}

export const combineUrlParams = (dirId: string | null | undefined, sort: string) => {
    const params: IParams = {};

    if (dirId) {
        params.parent = dirId;
    }

    if (sort) {
        params.sort = sort;
    }

    return params;
};
