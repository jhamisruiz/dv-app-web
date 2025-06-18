// Codigos de peticion del cliente.
export enum WSCLIENT {
  HEART = 10,
  LOGIN,
  CHAT_ROOM,
  CHAT_MESSAGE,
  GET_COMPONENT_CONFIG,
  GET_CUSTOM_LAYOUT,
  SAVE_CUSTOM_LAYOUT,
  GET_ACTIVITY,
  GET_CUSTOM_LABELS,
  RESET_CUSTOM_LABELS
}

// Codigos de respuesta del servidor.
export enum WSSERVER {
  HI = 0,
  HEART = 10,
  NOTIFY,
  CHAT_MESSAGE,
  COMPONENT_CONFIG,
  CUSTOM_LAYOUT,
}
