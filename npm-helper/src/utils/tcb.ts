const { VUE_APP_TCCB_API } = process.env;

interface TCBResponseData {
  data: Array<Npmtype>;
  requestId: string;
}
interface Npmtype {
  name: string;
  version: string;
  description: string;
  license: string;
  repoUrl: string;
  [prop: string]: string;
}

const DBAPi = `${VUE_APP_TCCB_API}npm-helper`;

/**
 * limit 不传，默认返回10条
 */
export const getNpmList = async (
  limit?: number,
  path?: string,
  name?: string
): Promise<TCBResponseData['data']> => {
  const queryStr = name ? `?name=${name}&` + (limit && `limit=${limit}`) : '';
  return fetch(`${DBAPi}${path ? '/' + path : ''}` + queryStr, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then(async res => {
      const { data } = await res.json();
      return data || [];
    })
    .catch(error => {
      console.error(error);
    });
};

/***
 * @params params 参数
 */
export const addNpmDoc = async (npm: Npmtype, path: string = '') => {
  return fetch(`${DBAPi}${path ? '/' + path : ''}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      ...npm,
      timestamp: Date.now(),
      createTime: new Date()
    })
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error);
    });
};

export const delNpmDoc = async (npm: Npmtype) => {
  return fetch(DBAPi, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(npm)
  }).then(res => res.json());
};

export const updateNpmDoc = async (npm: Npmtype) => {
  return fetch(DBAPi, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      ...npm,
      createTime: Date.now()
    })
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error);
    });
};
