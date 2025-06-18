interface UpParams {
  url: string;
  params: any;
}

export function UpdateParams(url: string, obj: any): UpParams {
  const [ruta, parametrosString] = url.split('?');
  const parametrosURL: any = {};
  const newParams: any = {};

  if (parametrosString) {
    parametrosString.split('&').forEach(parametro => {
      const [key, value] = parametro.split('=');
      parametrosURL[key] = decodeURIComponent(value);
    });
  }

  Object.entries(parametrosURL).forEach(([key, value]) => {
    (Object.prototype.hasOwnProperty.call(obj, key) ? obj : newParams)[key] = value;
  });
  return { url: ruta, params: { ...newParams, ...obj } };
}
