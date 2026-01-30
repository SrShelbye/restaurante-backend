/* */
export interface SocketResponse {
  ok: boolean;
  msg: string;
}

/* */
export interface SocketResponseData<T> extends SocketResponse {
  data?: T;
}
