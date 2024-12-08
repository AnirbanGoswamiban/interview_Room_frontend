export const SET_TOAST = 'SET_TOAST';
export const SET_CLIENT="SET_CLIENT"
export const SET_LOADER ="SET_LOADER"
export const SET_CUR_COMPONENT = "SET_CUR_COMPONENT"
export const SET_USER = "SET_USER"

export const setToast = (type,data) => ({
    type: SET_TOAST,
    payload: {
        type:type,
        message:data
    },
});

export const setLoader = (type,data) => ({
    type: SET_LOADER,
    payload: {
        type:type,
        message:data
    },
});

export const setCurConponent = (data) => ({
    type: SET_CUR_COMPONENT,
    payload: data
});

export const setUser = (data) => ({
    type: SET_USER,
    payload: data
});