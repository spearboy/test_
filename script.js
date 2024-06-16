import { interiors } from "./data.js";

// DOMContentLoaded 이벤트가 발생하면 함수를 실행합니다.
document.addEventListener("DOMContentLoaded", function () {
    const cursor = document.querySelector(".cursor"); // 커서 요소를 선택합니다.
    const gallery = document.querySelector(".gallery"); // 갤러리 요소를 선택합니다.
    const numberOfItems = 60; // 표시할 항목의 수를 정의합니다.
    const radius = 1100; // 항목을 원형으로 배치할 반지름을 설정합니다.
    const centerX = window.innerWidth / 2; // 화면의 중앙 x 좌표를 계산합니다.
    const centerY = window.innerHeight / 2; // 화면의 중앙 y 좌표를 계산합니다.
    const angleIncrement = (2 * Math.PI) / numberOfItems; // 각 항목의 각도 증가분을 계산합니다.

    // 항목 수 만큼 반복하여 항목을 생성하고 위치를 설정합니다.
    for (let i = 0; i < numberOfItems; i++) {
        const item = document.createElement("div");
        item.className = "item"; // 항목에 클래스를 부여합니다.
        const p = document.createElement("p");
        const count = document.createElement("span");
        p.textContent = interiors[i].name; // interiors 배열에서 항목 이름을 가져와 설정합니다.
        count.textContent = `(${Math.floor(Math.random() * 50) + 1})`; // 무작위 숫자를 생성하여 항목에 추가합니다.
        item.appendChild(p);
        p.appendChild(count);
        gallery.appendChild(item); // 갤러리에 항목을 추가합니다.

        // 각 항목의 위치와 회전을 설정하는 코드
        const angle = i * angleIncrement; // 항목의 각도를 계산합니다.
        const x = centerX + radius * Math.cos(angle); // x 좌표를 계산합니다.
        const y = centerY + radius * Math.sin(angle); // y 좌표를 계산합니다.
        const rotation = (angle * 180) / Math.PI; // 회전 각도를 계산합니다.

        // GSAP을 사용하여 항목의 위치와 회전을 설정합니다.
        gsap.set(item, {
            x: x + "px",
            y: y + "px",
            rotation: rotation,
        });

        // 항목에 마우스를 올렸을 때 이미지를 보여주는 이벤트 리스너
        item.addEventListener('mousemove', function () {
            const imgSrc = `./assets/img${i + 1}.jpg`; // 이미지 경로를 설정합니다.
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"; // 클립 패스 초기값 설정
            cursor.appendChild(img); // 커서 요소에 이미지를 추가합니다.

            // 이미지 클립 패스 애니메이션
            gsap.to(img, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
                duration: 1,
                ease: "power3.out",
            });
        });

        // 항목에서 마우스가 벗어났을 때 이미지를 숨기는 이벤트 리스너
        item.addEventListener("mouseout", function () {
            const imgs = cursor.getElementsByTagName("img");
            if (imgs.length) {
                const lastImg = imgs[imgs.length - 1];
                Array.from(imgs).forEach((img, index) => {
                    if (img !== lastImg) {
                        gsap.to(img, {
                            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                            duration: 1,
                            ease: "power3.out",
                            onComplete: () => {
                                setTimeout(() => {
                                    img.remove(); // 애니메이션이 끝난 후 이미지를 제거합니다.
                                }, 1000);
                            },
                        });
                    }
                });
                gsap.to(lastImg, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.25,
                });
            }
        });
    }

    // 스크롤 시 항목의 위치를 업데이트하는 함수
    function updatePosition() {
        const scrollAmount = window.scrollY * 0.0001; // 스크롤 양을 계산합니다.
        document.querySelectorAll(".item").forEach(function (item, index) {
            const angle = index * angleIncrement + scrollAmount;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const rotation = (angle * 180) / Math.PI;

            gsap.to(item, {
                duration: 0.05,
                x: x + "px",
                y: y + "px",
                rotation: rotation,
                ease: "elastic.out(1, 0.3)",
            });
        });
    }

    updatePosition(); // 초기 위치 설정
    document.addEventListener("scroll", updatePosition); // 스크롤 이벤트에 업데이트 함수를 연결합니다.
    
    // 마우스 움직임에 따라 커서 위치를 업데이트하는 이벤트 리스너
    document.addEventListener("mousemove", function (e) {
        gsap.to(cursor, {
            x: e.clientX - 150,
            y: e.clientY - 200,
            duration: 1,
            ease: "power3.out",
        });
    });
});
