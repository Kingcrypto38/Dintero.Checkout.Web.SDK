import pkg from "../package.json";

/**
 * Wraps window.location.assign()
 */
export const windowLocationAssign = (url: string) => {
    window.location.assign(url);
};

/**
 * Get the url for the session./yarn-error.log
.DS_Store
 */
export interface SessionUrlOptions {
    sid: string;
    endpoint: string;
    language: string | undefined;
    ui?: "fullscreen" | "inline";
    shouldCallValidateSession: boolean;
    popOut?: boolean
}

export const getSessionUrl = (options: SessionUrlOptions): string => {
    const { sid, endpoint, language, ui, shouldCallValidateSession, popOut } = options;
    if (!endpoint) {
        throw new Error("Invalid endpoint");
    }
    const params = new URLSearchParams();
    params.append('sdk', pkg.version);
    if(ui){
        params.append('ui', ui);
    }
    if(language){
        params.append('language', language);
    }
    if(shouldCallValidateSession){
        params.append('client_side_validation', 'true');
    }
    if(popOut) {
        params.append('role', 'pop_out_launcher');
    }
    if (endpoint === "https://checkout.dintero.com") {
        // Default endpoint will redirect via the view endpoint
        return `${endpoint}/v1/view/${sid}?${params.toString()}`;
    }
    // When a custom endpoint is set skip the view redirect endpoint since
    // custom endpoints like localhost and PR builds does not support the
    // serverside view flow.
    params.append('sid', sid);
    return `${endpoint}/?${params.toString()}`;
};

const padTralingSlash = (endpoint: string) => endpoint.endsWith('/') ? endpoint : `${endpoint}/`;

export const getPopOutUrl = ({ sid, endpoint, language, shouldCallValidateSession }: SessionUrlOptions) => {
    if (shouldCallValidateSession) {
        return `${padTralingSlash(endpoint)}?loader=true`;
    }
    const params = new URLSearchParams();
    params.append('ui', 'fullscreen');
    params.append('role', 'pop_out_payment');
    params.append('sid', sid);
    params.append('sdk', pkg.version);
    if (language) {
        params.append('language', language);
    }
    return `${endpoint}/?${params.toString()}`;
};
