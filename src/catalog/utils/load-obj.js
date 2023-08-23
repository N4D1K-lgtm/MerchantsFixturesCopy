import MTLLoader from './mtl-loader';
import OBJLoader from './obj-loader';

export function loadObjWithMaterial(mtlFile, objFile, imgPath) {
  let mtlLoader = new MTLLoader();
  mtlLoader.setTexturePath(imgPath);
  let url = mtlFile;
  return new Promise((resolve, reject) => {

    mtlLoader.load(url, materials => {
      materials.preload();
      let objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objFile, object => resolve(object));

    });
  });
}

export function loadObj(objContent) {
  return new Promise((resolve, reject) => {
    let objLoader = new OBJLoader();
    try {
      const object = objLoader.parse(objContent);
      resolve(object);
    } catch (error) {
      reject(error);
    }
  });
}