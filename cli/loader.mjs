let is_main = true;

export const load = (url, context, loadNext) => {
    if (is_main) {
        is_main = false;

        if (!context.format) {
            context.format = "commonjs";
        }
    }

    return loadNext(url, context, loadNext);
};
