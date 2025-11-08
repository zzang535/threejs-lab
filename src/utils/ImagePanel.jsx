import { MeshBasicMaterial, DoubleSide, Mesh } from "three";

// 특정 폴더 이미지 전체 import
const images = import.meta.glob("../images/randomImages/*.jpg");

// import 된 이미지들 중에 랜덤으로 1개의 src 리턴
async function getRandomImage(images) {
  const values = Object.values(images);
  const randomIndex = Math.floor(Math.random() * values.length);
  const importMethod = values[randomIndex];
  const module = await importMethod();
  const result = module.default;
  return result;
}

export class ImagePanel {
  constructor(info) {
    this.init(info);
  }

  async init(info) {
    const imageSrc = await getRandomImage(images);
    const texture = info.textureLoader.load(imageSrc);
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
    });

    this.mesh = new Mesh(info.geometry, material);
    this.mesh.position.set(info.x, info.y, info.z);
    this.mesh.lookAt(0, 0, 0);

    // sphere 상태의 회전각 저장해둠
    this.sphereRotationX = this.mesh.rotation.x;
    this.sphereRotationY = this.mesh.rotation.y;
    this.sphereRotationZ = this.mesh.rotation.z;

    info.scene.add(this.mesh);
  }
}
