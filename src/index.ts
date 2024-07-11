import { threeInstance } from "./three/index";

const { render, initialize, startAnimation } = threeInstance(document.getElementById("container") as HTMLDivElement);

initialize(true);
function animate() {
    requestAnimationFrame(animate);
    render();
}
animate();
window.addEventListener("click", () => {
    startAnimation();
});
