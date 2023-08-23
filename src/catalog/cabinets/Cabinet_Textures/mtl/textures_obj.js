import { TextureLoader } from "three";
import * as THREE from "three";
import { loadObj } from "@catalog/utils/load-obj";
//import obj from "../../../catalog/cabinets/beverage_24_depth/blbs_1824/blbs_1824.obj";

export const textures = {
  body: {
    ClassicMaple: {
      name: 'Classic Maple',
      uri: import('../Cabinet_Materials/classic_maple.png'),
    },
    ClassicBlack: {
      name: 'Classic Black',
      uri: import('../Cabinet_Materials/classic_black.png'),
    },
    ClassicChocolate: {
      name: 'Classic Chocolate',
      uri: import('../Cabinet_Materials/classic_chocolate.png'),
    },
    Equinox: {
      name: 'Equinox',
      uri: import('../Cabinet_Materials/equinox.png'),
    },
    Lago: {
      name: 'Lago',
      uri: import('../Cabinet_Materials/lago.png'),
    },
    NovaWhite: {
      name: 'Nova White',
      uri: import('../Cabinet_Materials/nova_white.png'),
    },
    Samba: {
      name: 'Samba',
      uri: import('../Cabinet_Materials/samba.png'),
    },
    TitanGrey: {
      name: 'Titan Grey',
      uri: import('../Cabinet_Materials/titan_grey.png'),
    },
  },
  tops: {
    ArcticWhite: {
      name: 'Arctic White',
      uri: import('../Counter_Top_Materials/arctic_white.png'),
    },
    Coal: {
      name: 'Coal',
      uri: import('../Counter_Top_Materials/coal.png'),
    },
    Concrete: {
      name: 'Concrete',
      uri: import('../Counter_Top_Materials/concrete.png'),
    },
    Galaxy: {
      name: 'Galaxy',
      uri: import('../Counter_Top_Materials/galaxy.png'),
    },
    Iceberg: {
      name: 'Iceberg',
      uri: import('../Counter_Top_Materials/iceberg.png'),
    },
    Oahu: {
      name: 'Oahu',
      uri: import('../Counter_Top_Materials/oahu.png'),
    },
    PlatinumGrey: {
      name: 'Platinum Grey',
      uri: import('../Counter_Top_Materials/platinum_grey.png'),
    },
    RoyalCarrea: {
      name: 'Royal Carrea',
      uri: import('../Counter_Top_Materials/royal_carrera.png'),
    },
    SilverFalls: {
      name: 'Silver Falls',
      uri: import('../Counter_Top_Materials/silver_falls.png'),
    },
    VictoriaFalls: {
      name: 'Victoria Falls',
      uri: import('../Counter_Top_Materials/victoria_falls.png'),
    },
  },
  cups: {
    cups: {
      name: 'cups',
      uri: import('../mtl/dark_grey.png')
    }
  }
};

export function render3D(obj) {
  return {
    render3D: function (element) {

      let onLoadItem = (object) => {
        object.scale.set(100, 100, 100);

        // Set the pivot point to the center of the object
        const box = new THREE.Box3().setFromObject(object);

        //set the center point for the object
        const center = new THREE.Vector3();
        box.getCenter(center);
        center.y = 0;
        object.position.sub(center);

        dynamicMaterial(element, object);

        return object;

      };

      return loadObj(obj).then(object => {
        return onLoadItem(object.clone());
      });
    }
  };
}

function populateTops(json) {
  let textureValues = {};

  for (let textureName in json) {
    textureValues[textureName] = textureName;
  }

  return textureValues;
}

export const tops = populateTops(textures.tops);
export const body = populateTops(textures.body);

export const properties =
{
  properties: {
    texture: {
      label: 'Countertop Material',
      type: 'enum',
      defaultValue: tops[Object.keys(tops)[0]],
      values: tops
    },
    texture1: {
      label: 'Cabinet Material',
      type: 'enum',
      defaultValue: body[Object.keys(body)[0]],
      values: body
    }
  }
};


export async function dynamicMaterial(element, object) {

  let textureTopName = 'texture';
  let textureBodyName = 'texture1';
  let textureCupName = 'texture2';

  const applyTexture = async (material, uriPromise) => {
    let loader = new TextureLoader();
    const uri = await uriPromise; // Wait for the promise to resolve
    const textureUrl = uri.default ? uri.default : uri;
    material.map = loader.load(textureUrl);
    material.needsUpdate = true;
  };

  async function findTextureAndApply(textureOrTexture1, textureAssetJson) {
    let textureNameAsKey = element.properties.get(textureOrTexture1);
  
    let children = object.children;
    let index = children.findIndex(child => child.material.name === textureOrTexture1);
    if (index >= 0) {
      let material = children[index].material;
      await applyTexture(material, textureAssetJson[textureNameAsKey].uri);
    }
  }
  
  async function findTextureAndApplyDirect(textureOrTexture1, textureAssetJson) {
    let children = object.children;
    let arr = children.filter(child => child.material.name === textureCupName);
    for (let item of arr) {
      let material = item.material;
      await applyTexture(material, textureAssetJson['cups'].uri);
    }
  }


  await findTextureAndApply(textureBodyName, textures.body);
  await findTextureAndApply(textureTopName, textures.tops);
  await findTextureAndApplyDirect(textureCupName, textures.cups);

}

