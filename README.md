# DeliOrder

<div align="center">
<img width="50%" alt="image" src="https://github.com/user-attachments/assets/e47a0f43-b409-4e4b-833b-d5fa9fa45256">
</div>

<div align="center">
<a href="https://github.com/DeliOrder/DeliOrder-Client">클라이언트 </a> | <a href="https://github.com/DeliOrder/DeliOrder-Server">서버 </a> | <a href="https://catnip-puppy-52c.notion.site/1ad7604d886e80d99206da13e03953cd?source=copy_link">정리 노션 </a>
</div>
<br>

<div align="center">

**DeliOrder**는 사용자의 지시를 배달한다는 뜻의 Deliver + Order의 합성어로,<br> 사용자가 **파일 작업 자동화 매크로**를 만들고 쉽게 **공유**하여 **실행**할 수 있는 서비스를 제공하는 데스크탑 애플리케이션 입니다.

</div>

## 🔷 내비게이션

<!-- toc -->

- [🔷 소개영상](#%F0%9F%94%B7-%EC%86%8C%EA%B0%9C%EC%98%81%EC%83%81)
- [🔷 개발 환경](#%F0%9F%94%B7-%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD)
  - [AWS S3 를 추가한 이유](#aws-s3-%EB%A5%BC-%EC%B6%94%EA%B0%80%ED%95%9C-%EC%9D%B4%EC%9C%A0)
  - [Node.js 와 Elctron](#nodejs-%EC%99%80-elctron)
  - [주요 라이브러리 소개](#%EC%A3%BC%EC%9A%94-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%86%8C%EA%B0%9C)
- [🔷 문제 해결하기: (1) macOS 와 Windows 호환성 이슈](#%F0%9F%94%B7-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0-1-macos-%EC%99%80-windows-%ED%98%B8%ED%99%98%EC%84%B1-%EC%9D%B4%EC%8A%88)
  - [1. 자소 분리 통합시키기](#1-%EC%9E%90%EC%86%8C-%EB%B6%84%EB%A6%AC-%ED%86%B5%ED%95%A9%EC%8B%9C%ED%82%A4%EA%B8%B0)
  - [2. 경로 표기 통일시키기](#2-%EA%B2%BD%EB%A1%9C-%ED%91%9C%EA%B8%B0-%ED%86%B5%EC%9D%BC%EC%8B%9C%ED%82%A4%EA%B8%B0)
- [🔷 문제 해결하기: (2) 실행 파일 전송 가능하게 하기](#%F0%9F%94%B7-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0-2-%EC%8B%A4%ED%96%89-%ED%8C%8C%EC%9D%BC-%EC%A0%84%EC%86%A1-%EA%B0%80%EB%8A%A5%ED%95%98%EA%B2%8C-%ED%95%98%EA%B8%B0)
  - [“.app” 확장자 인식가능하게 하기](#app-%ED%99%95%EC%9E%A5%EC%9E%90-%EC%9D%B8%EC%8B%9D%EA%B0%80%EB%8A%A5%ED%95%98%EA%B2%8C-%ED%95%98%EA%B8%B0)
    - [파일 선택기 구현을 통한 문제 해결](#%ED%8C%8C%EC%9D%BC-%EC%84%A0%ED%83%9D%EA%B8%B0-%EA%B5%AC%ED%98%84%EC%9D%84-%ED%86%B5%ED%95%9C-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0)
    - [파일 객체를 이용한 업로드 기능](#%ED%8C%8C%EC%9D%BC-%EA%B0%9D%EC%B2%B4%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%97%85%EB%A1%9C%EB%93%9C-%EA%B8%B0%EB%8A%A5)
- [🔷 문제 해결하기 : (3) 모달 관리 문제, 관심사 분리로 해결하기](#%F0%9F%94%B7-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0--3-%EB%AA%A8%EB%8B%AC-%EA%B4%80%EB%A6%AC-%EB%AC%B8%EC%A0%9C-%EA%B4%80%EC%8B%AC%EC%82%AC-%EB%B6%84%EB%A6%AC%EB%A1%9C-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0)
  - [중복된 형태의 상태값 사용, 커스텀 훅으로 캡슐화 하기](#%EC%A4%91%EB%B3%B5%EB%90%9C-%ED%98%95%ED%83%9C%EC%9D%98-%EC%83%81%ED%83%9C%EA%B0%92-%EC%82%AC%EC%9A%A9-%EC%BB%A4%EC%8A%A4%ED%85%80-%ED%9B%85%EC%9C%BC%EB%A1%9C-%EC%BA%A1%EC%8A%90%ED%99%94-%ED%95%98%EA%B8%B0)
  - [알림 메시지 모달은 전역에서 단 1개로 관리하기](#%EC%95%8C%EB%A6%BC-%EB%A9%94%EC%8B%9C%EC%A7%80-%EB%AA%A8%EB%8B%AC%EC%9D%80-%EC%A0%84%EC%97%AD%EC%97%90%EC%84%9C-%EB%8B%A8-1%EA%B0%9C%EB%A1%9C-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0)
- [🔷 협업일지](#%F0%9F%94%B7-%ED%98%91%EC%97%85%EC%9D%BC%EC%A7%80)
  - [1. 적극적인 소통은 협업의 기본](#1-%EC%A0%81%EA%B7%B9%EC%A0%81%EC%9D%B8-%EC%86%8C%ED%86%B5%EC%9D%80-%ED%98%91%EC%97%85%EC%9D%98-%EA%B8%B0%EB%B3%B8)
  - [2. 문서화의 중요성](#2-%EB%AC%B8%EC%84%9C%ED%99%94%EC%9D%98-%EC%A4%91%EC%9A%94%EC%84%B1)
  - [3. 정보 공유로 향상되는 팀워크와 효율](#3-%EC%A0%95%EB%B3%B4-%EA%B3%B5%EC%9C%A0%EB%A1%9C-%ED%96%A5%EC%83%81%EB%90%98%EB%8A%94-%ED%8C%80%EC%9B%8C%ED%81%AC%EC%99%80-%ED%9A%A8%EC%9C%A8)
  - [4. 3인이라는 소수 구성원의 의사결정 전략](#4-3%EC%9D%B8%EC%9D%B4%EB%9D%BC%EB%8A%94-%EC%86%8C%EC%88%98-%EA%B5%AC%EC%84%B1%EC%9B%90%EC%9D%98-%EC%9D%98%EC%82%AC%EA%B2%B0%EC%A0%95-%EC%A0%84%EB%9E%B5)
- [🔷 팀원 소개](#%F0%9F%94%B7-%ED%8C%80%EC%9B%90-%EC%86%8C%EA%B0%9C)

<!-- tocstop -->

## 🔷 소개영상

[![소개 영상](https://github.com/user-attachments/assets/ba71fc71-10b6-4a9e-aaba-8a0567136067)](https://www.youtube.com/watch?v=aAUX4gzjYWI)
<br>

## **🔷 개발 환경**

| 분류             | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **개발 언어**    | <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **클라이언트**   | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"> <img src="https://img.shields.io/badge/electron-47848F?style=for-the-badge&logo=electron&logoColor=black"> <img src="https://img.shields.io/badge/zustand-54283c?style=for-the-badge&logo=zustand&logoColor=black"> <img src="https://img.shields.io/badge/tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=black"> |
| **서버**         | <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">                                                                                                                                                                                                                    |
| **데이터베이스** | <img src="https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white"> <img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> <img src="https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white">                                                                                                                                                                                                            |
| **라이브러리**   | **trash**, **MIME**, **yauzl**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### **AWS S3 를 추가한 이유**

본 서비스에서는 “생성” 이라는 매크로 행동시 첨부파일을 전달할 수 있게 설계되었습니다. 대용량 데이터인 첨부파일을 처리하기 위해 AWS S3를 연결하였습니다. AWS S3는 대량의 데이터를 처리하도록 설계된 확장성이 뛰어난 클라우드 스토리지 서비스로, 원하는 양의 데이터를 저장하고 사용할 수 있습니다. 대용량 파일을 전송하는 데에는 비용 부담이 있기 때문에 AWS S3 에 첨부파일을 업로드 하고 다운로드하는 동작은 클라이언트(Electron 의 renderer process)에서 처리해 서버의 부담을 줄였습니다.

### **Node.js 와 Elctron**

본 서비스는 파일 시스템 모듈이 반드시 필요한 서비스입니다. 따라서 자바스크립트로 접근이 가능한 Node.js 를 사용하게 되었습니다. Node.js 는 C++ 로 만들어져 있기 때문에 운영체제에 접근이 가능했습니다.

Node.js 에서 제공되는 파일 시스템 모듈을 활용하여 조작이 가능하게 했으니, 사용자가 사용하게 할 수 있는 GUI 가 필요했습니다. 이에 몇 가지 비교와 조사를 통해 Node.js 를 기반으로 한 Electron 을 사용해 개발하게 되었습니다. Electrone의 V8, Chromium의 결합이 개발 함에 있어서 좋은 베이스가 되었습니다.

### **주요 라이브러리 소개**

- **trash** : ‘휴지통’을 특정해 주는 라이브러리입니다. 삭제하기 기능 구현을 위해 사용되었습니다. 기존 파일시스템 모듈에서의 ‘삭제’는 진정한 의미의 delete였기 때문에 실제로 행했을 때의 리스크가 크다고 판단되었습니다. 대신 사용자가 언제든지 복구할 수 있도록 ‘휴지통’으로 이동시키는 방향으로 구현을 진행했습니다.
- **MIME** : 파일 객체를 만들 때 필요한 MIME 타입을 알려주는 라이브러리입니다. 파일 선택기를 구현함에 있어 S3에 파일을 업로드하기 위해 파일 객체로 바꿔주어야 하는데 사용자에 따라 다양한 파일이 존재하므로 수많은 파일에 대해 MIME 타입을 추출하기 위해 사용하였습니다.
- **yauzl** : 압축 해제를 도와주는 라이브러리입니다. 단순 압축 해제를 구현하기에는 복잡한 알고리즘, 바이트 레벨에서 작업, 복원 과정에서 에러 처리 등 꽤 난이도 있는 작업이기 때문에 시간적인 측면과 중요도 측면에서 고려했을 때 라이브러리의 도움을 받기로 결정하였습니다.

## **🔷 문제 해결하기: (1) macOS 와 Windows 호환성 이슈**

> 구현 중 마주한 어려움 중 가장 큰 주제는 다른 운영체제 간의 호환성을 유지하는 것이었습니다. 서비스로서 생각할 때 사용자들이 보편적으로 많이 쓰는 macOS 와 Windows 운영체제에서 호환이 가능해야 한다고 생각을 했습니다.

### **1. 자소 분리 통합시키기**

> 다른 운영체제 간 한글명 파일을 주고받던 중 한글 깨짐 증상이 발생하였습니다.

![자소분리 예시](https://github.com/user-attachments/assets/8b46e7c5-d9f9-4342-9f1d-2e9dd536bc27)

위 사진처럼 사진이나 압축된 폴더, 여러 다른 파일 제목에 대해서 **글자가 분리돼서 나오는 현상을 자소 분리 현상**이라고 하고 이러한 문제가 발생하는 이유는 **운영체제 간에 인코딩 디코딩 방식이 달라서**입니다.

- 윈도우 경우 → CP949, EUC-KR 이라는 방식으로 인코딩이 이루어지고,
- 맥 경우 → UTF-8 이라는 방식을 통해 인코딩이 이루어집니다.

이를 해결하기 위해서는 2가지 방법이 있습니다.

첫 번째 인코딩 디코딩 방식을 일치 시켜주어야 합니다.

두 운영체제 간의 인코딩, 디코딩 방식이 다르기 때문에 발생한 문제로 간단히 일치만 시켜주면 되는데 그럴 경우 보내는 데이터에 대해서 어느 운영체제에서 만들어졌는지 추가적인 설명(메타데이터)이 또 추가되기 때문에 문자 표현에 있어서는 두 번째 방법을 사용하였고 압축 해제할 때는 해당 방법을 사용하였습니다.

두 번째 디코딩 된 문자 표현 결과를 일치시켜줍니다.

경로상 문자 표현이나 파일 제목의 경우 “ㄱ”, “ㅗ”, “ㅁ”처럼 분리되어 있는 문자일 때 `.normalize("NFC")` 코드를 사용해서 “곰”으로 합치는 추가 과정을 넣어줌으로써 어떠한 문자 표현 결과가 나와도 완성형 표현으로 일치시킬 수 있습니다.

```jsx
  const normalizedPath = normalizePath(convertedPath).normalize("NFC");
****
  return normalizedPath;
                                            경로상 한글 문제 해결(두번째 방법)
-----------------------------------------------------------------------
																						압축해제 한글 문제 해결(첫번째 방법)

  const decodedFileNameFromWindow = iconv
    .decode(fileNameBuffer, "cp949")
    .normalize("NFC");

  const decodedFileNameFromMac = iconv
    .decode(fileNameBuffer, "utf-8")
    .normalize("NFC");
  let decodedFileName = decodedFileNameFromMac;

  if (decodedFileName.includes("�")) {
    decodedFileName = decodedFileNameFromWindow;
  }

```

문자 표현의 경우 두 번째 방법을 이용해서 해결해 주고, 압축 해제의 경우 첫 번째 방법을 이용해서 해결해 주었습니다.

### **2. 경로 표기 통일시키기**

> macOS는 경로를 표기할 때 “ `/` “로 구분 짓습니다. Windows는 “ `\`“으로 구분 짓습니다. 단순히 방향의 차이로 보이지만 이로 인해 서로 경로를 인식할 수 없는 사태가 일어납니다. 한국 지도를 미국에서 사용해야 하는 것 같은 이야기입니다.

구현 시 사용한 파일 시스템 모듈은 매개변수로 파일 경로를 포함한 파일 문자열을 받습니다. 운영체제마다 경로 표현 방식이 다르기 때문에 이 경로를 그대로 사용할 경우 문제가 발생할 수 있습니다. 그 차이는 주로 다음과 같은 부분에서 나타납니다.

1. 드라이브의 사용 : Windows에는 드라이브 개념이 있어 C 드라이브에서부터 경로가 시작됩니다. macOS의 경우 루트 디렉터리부터 시작합니다.
2. 경로 구분자의 차이 : Windows 는 백슬래쉬 (`\\`)를 사용하는 반면, OS의 경우 슬래쉬(`/`)를 사용합니다.

   파일 시스템 모듈의 normalize 메서드를 사용해 이 차이를 해결하려 했지만, 경로 구분자가 혼용된 경우 정규화가 제대로 이루어지지 않는 문제가 있었습니다.

3. 운영체제별 특수 디렉터리 :

   대표적으로 어플리케이션 설치 위치가 그렇습니다. Visual Studio Code 을 예로 들어보겠습니다.

   - Applications (macOS only) : `/Applications/Visual Studio Code.app`
   - Program Files (Windows only) : `C:\\\\Program Files\\\\Visual Studio Code`

     각각의 운영체제에서 다른 폴더명에 담기는 것을 볼 수 있습니다. Applications 와 Program Files는 비슷한 역할을 하지만 이름이 다르게 붙여졌습니다. 일반적인 파일이 내용물로 담기며 경로의 깊이도 비슷합니다. 이 경우에는 서로 호환해도 좋아 보입니다.

     하지만 Library (macOS only) 와 AppData (Windows only)는 각 운영체제가 고유하게 갖고 있는 폴더입니다. 두 가지 모두 어플리케이션의 설정 내용을 갖고 있습니다. 비슷한 역할을 하지만 둘 다 민감한 정보를 담고 있고, 무엇보다 두 경로의 경우 경로의 깊이가 일정하지 않다는 특징이 있습니다.

이러한 문제들을 해결하기 위해 **만든 normalize 유틸 함수**의 동작은 아래와 같습니다.

1. 패키지를 받은 수신자의 운영체제를 확인하고 경로 구분자의 방향을 바꿔줍니다.
2. 경로를 홈 디렉터리(homedir)로부터 시작하도록 정정합니다.
3. 각 운영체제 별 호환 가능한 특수한 디렉터리가 있다면 경로 이름을 바꿔줍니다.
4. Library 와 AppData 와 같이 좀 더 민감한 설정 데이터를 가지고 있는 경우 경로를 호환하지 않습니다.

이 과정은 비교적 단순해 보이지만, 실제로는 여러 엣지 케이스를 처리하는 데 많은 노력이 필요했습니다. 덕분에 **윈도우와 유닉스 계열 OS 간의 경로 호환성을 개선**할 수 있었습니다.

## **🔷 문제 해결하기: (2) 실행 파일 전송 가능하게 하기**

> “생성하기” 명령을 수행할 경우 Mac에서 브라우저 파일 선택기를 이용해서. app 파일을 Window 에 보낼 경우 이때. zip 파일로 인식되는 문제가 발생하는 문제가 있었습니다.

### **“.app” 확장자 인식가능하게 하기**

문제가 발생하는 원인을 조사해 보니 app 확장자가 Mac에서 실행되도록 만들어진 프로그램 파일로써 해당 애플리케이션을 실행하는데 필요한 모든 파일을 포함한 특별한 유형의 폴더이기 때문이라는 것을 알게 되었습니다.

![잘못된 앱 인식과정](https://github.com/user-attachments/assets/856e97e2-c40e-4664-82fc-11120a3a266d)

### **파일 선택기 구현을 통한 문제 해결**

브라우저에서 제공하는 파일 선택기를 사용해서 app 확장자 파일에 접근할 경우 폴더로 인식하여서 하위 폴더로 진입하는 문제가 발생하였습니다. 이렇게 app 확장자를 폴더로 인식하는 문제를 해결하기 위해 Electron에서 파일 선택기를 구현하는 방법을 택하였습니다.

```jsx
const result = await dialog.showOpenDialog({
  properties: ["openFile"],
});

const selectedFilePath = result.filePaths[0];
const { base: attachmentName, ext: extension } = path.parse(selectedFilePath);
```

위처럼 Electron에서 파일 선택기를 구현해서 파일을 선택할 경우 파일의 각각 이름과 확장자에 접근이 가능하므로 '.app' 확장자 파일에 . 그런데 해당 파일을 S3에 전송하려고 보니 업로드가 되지 않는 현상이 발생하였습니다.

### **파일 객체를 이용한 업로드 기능**

이번에도 해당 문제가 발생하는 원인을 조사해 보니 파일을 업로드하기 위해서는 파일 객체가 필요하다는 것을 알게 되었고, 파일 객체를 만들기 위해서는 버퍼 객체, 파일 이름, 해당 파일 타입을 알아야 했기 때문에 Electron main 프로세스에서 아래와 같은 코드를 통해 파일 객체를 구현을 했습니다.

```jsx
const fileBuffer = fs.readFileSync(selectedFilePath);
const baseName = path.basename(selectedFilePath);
const mimeType = mime.getType(extension);
const fileObj = new File(fileBuffer, baseName, {
  type: mimeType,
});
```

그렇게 모든 문제가 해결되는 듯 보였으나 파일 객체로 업로드를 할 시, 파일이 이상하게 깨져서 올라가는 문제가 발생하였습니다. 원인을 조사해 보니 브라우저 파일 선택기로 만들어지는 파일 객체 경우 blob 객체를 통해서 만들어지기 때문이었습니다. 이에 맞춰 버퍼 객체 대신 blob 객체를 이용해서 만들어 해결하였습니다.

```jsx
const fileBuffer = Buffer.from(fileBase64, "base64");
const arrayBuffer = fileBuffer.buffer.slice(
  fileBuffer.byteOffset,
  fileBuffer.byteOffset + fileBuffer.byteLength,
);

const blobObj = new Blob([arrayBuffer], { type: mimeType });
const fileObj = new File([blobObj], baseName, {
  type: mimeType,
});
```

아까 만들어두었던 버퍼 객체를 이용해서 blob 객체를 만들어 다시 파일 객체를 만들어주니 잘 해결이 되는 것을 볼 수 있습니다.

## **🔷 문제 해결하기 : (3) 모달 관리 문제, 관심사 분리로 해결하기**

<img width=80% alt="모달 충돌 상황" src="https://github.com/user-attachments/assets/055b218c-f841-4248-987a-e3d09850f560">

> 모달형 UI와 알림 메시지 모달을 동시에 사용하면서 여러 상태를 관리해야 했고, 이로 인해 유지 보수가 어려워졌습니다. 잘못된 상태값 처리로 인해 엉뚱한 메시지가 출력되거나, 상태 정리가 제때 이루어지지 않아 모달이 겹쳐 보이지 않는 문제도 발생했습니다.

대표적으로 모달을 사용하는 컴포넌트 중 하나인 ‘받기’ 화면입니다.

<img width=80% alt="이전 모달 상태값(1)" src="https://github.com/user-attachments/assets/710cb4b5-30f7-4e03-88ce-f404559c946f">
<img width=80% alt="이전 모달 상태값(2)" src="https://github.com/user-attachments/assets/35ef4599-1501-402c-b7ab-5f3c68f0c514">

모달을 위한 상태값이 무분별하게 증가했습니다. 단지 디자인에 따라 Modal 컴포넌트는 1개, InfoModal 컴포넌트는 2개를 사용하고 있었으며, 이를 위해 5개의 상태값이 존재했습니다. 이로 인해 각 컴포넌트가 평균 1.6개의 상태값을 가지게 되었고, 상태값 관리의 복잡도가 높아졌습니다.

### 중복된 형태의 상태값 사용, 커스텀 훅으로 캡슐화 하기

모달을 닫기 위한 최소한의 상태값을 사용하기 위해 전용 커스텀 훅을 만들었습니다. 이 훅은 모달의 열림 상태와 여는 함수, 닫는 함수를 반환합니다.

```jsx
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return [isOpen, openModal, closeModal];
};
```

이 커스텀 훅을 통해 모달을 관리하는 방식으로 전환하면서 컴포넌트당 1개의 모달 상태만 관리하게 되어 코드가 간결해졌고 유지 보수도 용이해졌습니다. 또한, 컴포넌트 언마운트 시 자동으로 상태가 정리되는 장점이 있어 상태값 누락으로 인한 오류도 방지할 수 있었습니다.

![이후 모달 상태값](https://github.com/user-attachments/assets/f74c399f-d420-4740-b924-51364357d24f)

1개의 상태값만 사용하게 되었습니다.

### 알림 메시지 모달은 전역에서 단 1개로 관리하기

사용자는 일반적으로 현재 발생하고 있는 동작에 관한 알림 단 1개면 충분합니다. 그중 ‘닫기’ 버튼을 누르면서까지 뜨는 알림은 비교적 중요한 알림으로 관심을 집중시켜야 합니다. 이 경우 여기저기 알림이 떠 있다면 메시지 전달력도 떨어지고 사용자에게 피로감을 가중시킵니다.

알림 모달 상태 관리를 중앙 스토어에 맡기고, 컴포넌트는 App.jsx에서 렌더링하도록 설계했습니다.

```jsx
//알림 전용 모달 컴포넌트
function InfoModal() {
  // 중앙에서 관리하는 상태값
  const { infoModal, closeInfoModal } = usePackageStore();

  return (
    <Modal title="알림" isOpen={infoModal.isOpen} onClose={closeInfoModal}>
      {infoModal.message}
    </Modal>
  );
}
```

이로써 알람은 중요한 순간에 한 번에 하나씩만 뜨도록 관리됩니다.

![modal_success](https://github.com/user-attachments/assets/b3fbf107-97a9-43df-b987-c1533c163166)

결과적으로 상태를 분리하여 모달 관리의 복잡성을 줄이고 컴포넌트 사용을 용이하게 만들면서 사용자 경험을 최적화하는 데 성공했습니다.

## **🔷 협업일지**

> 코어타임 : 10:00 ~ 22:00
>
> 깃 전략 : Git Flow 전략 사용. (merge를 사용하여 commit 기록 유지)
>
> 그 외에 저희 팀이 사용한 협업 비법을 소개합니다.

### **1. 적극적인 소통은 협업의 기본**

> 소통의 활성화를 위해 PR 리뷰 및 회의 시간을 적극 활용했습니다.

협업을 하면서 서로 적극적으로 의견을 내는 것이 중요합니다. 서로 업무 현황에 협의가 됐는지, 전달이 잘 되었는지 확인이 되어야 두 번, 세 번 작업하는 일이 적어집니다. 또한 활발히 대화를 해야 서로 어떤 성격이나 작업 방식을 가지고 있는지 파악이 되고 업무 효율을 증가시킬 수 있습니다.

주어진 프로젝트 기간을 잘 활용하는 것도 중요했기에 서로 소통함에 있어 약속을 몇 가지 정했습니다.

- 회의
  - 오전 10시 회의: 전날 업무 상황 공유, 당일 업무 분배.
  - 오후 7시 회의: 현재 진행 상황 공유.
- 문제상황
  - 문제 상황이 생겼을 경우 3시간 이후엔 팀원에게 현재 상황 알려주기.
  - 문제 상황을 하루 이상 넘기지 않기.
- PR 관련
  - PR 리뷰는 바로바로 진행하기.
  - PR 리뷰를 활용해 적극적으로 소통하기.

실제로 PR 리뷰를 통해 하는 소통은 매주 나날이 늘어갔습니다.

| <img width="220" alt="image" src="https://github.com/user-attachments/assets/47787445-9483-437c-91d0-4f984b65dd16"> | <img width="220" alt="image" src="https://github.com/user-attachments/assets/c02175d4-61f9-4fc4-ae26-31b0e0287ff3"> | <img width="220" alt="image" src="https://github.com/user-attachments/assets/b00f4ec1-7136-43ab-9b57-9ceb922db987"> |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1주차 평균 10개                                                                                                     | 2주차 평균 16개                                                                                                     | 3주차 평균 24.7개 (최고 기록은 46개)                                                                                |

PR 리뷰도 즉각 즉각 진행했기 때문에, 수정사항 등에 대한 개선 및 반영이 빠르게 이루어졌고, 이것이 워크 플로우로 자리를 잡으니 다음 작업으로 진행하는 속도가 빨라졌습니다.

### **2. 문서화의 중요성**

> 중요한 의사결정 결과 혹은 흔적을 회의록으로 남겼습니다. 회의 이후 기억이 나지 않더라도 회의록을 통해 협의된 내용을 확인할 수 있습니다. [**[🔗 회의록 리스트]**](https://www.notion.so/6564428a53024453bddbd35729a9b0bf?pvs=21)

![회의록](https://github.com/user-attachments/assets/29f8059f-2c9f-4292-bfe4-16cfb25508d4)
회의록 부분발췌

처음부터 문서화를 적극적으로 했던 부분은 아니었습니다. 첫 주는 회의하고 구현 사항을 만들기 바빴고 실무에 문서화 작업을 뒤로 제쳐두었습니다. 하지만 서로 회차가 거듭해 갈수록 협의된 내용이 기억 속에서 조금씩 다르다는 것이 확인되었고 이를 명확히 해둘 필요가 있겠다고 생각했습니다.

### **3. 정보 공유로 향상되는 팀워크와 효율**

> 서로의 지식을 공유하는 것은 시간을 뺏는 일처럼 느껴질 수 있지만, 서로의 코드를 이해하는데 큰 도움이 되기도 했습니다. 각자 구현 사항 중 조사하거나 공부한 내용을 문서로 남겨 도움을 주고자 했습니다.

구현의 큰 흐름은 알고 있지만 서로 구현된 세부사항에 관해서는 잘 모를 수밖에 없습니다. 수시로 상황 공유를 하고 의견을 나누고 있었기 때문에 구현 중에 발생하는 크고 작은 어려움들을 들을 수 있었고 일정 기간 동안 해결이 안 되면 함께 상의를 하곤 했습니다. 이때 도움이 되었던 건 각자 조사하고 공부한 내용을 자료로 함께 전달해 주는 것이었습니다.

**“ 어떤 부분을 활용했고, 이런 부분까진 조사를 해보았는데, 어디가 잘되지 않았다. “라는** 서두와 함께 자료를 활용했습니다. 그럼 조사된 자료를 훑어보고 함께 얘기를 나누곤 했습니다.

때로는 서로에게 더 넓은 선택지를 전달하기 위해 사용하기도 했습니다. PR 리뷰 중 의견을 전달할 때, 잘 정리된 문서의 링크를 전달하거나 키워드만 전달하는 경우도 있었지만 직접 자료를 가공하여 전달해 주기도 했습니다. 어떤 방식이든 전달받는 이에게 좋은 리소스가 되었습니다.

활용 예)

![노션 첨부 예시](https://github.com/user-attachments/assets/414cd412-1822-4afb-b87a-9237583b53f9)

PR 리뷰를 이용해 자료를 공유하는 모습

### **4. 3인이라는 소수 구성원의 의사결정 전략**

> 인원이 적은 조직일수록 의사결정 시, 빠른 의사결정이 나기도 하지만 반대로 어두운 등잔 밑을 충분히 확인하지 못하고 가기도 합니다. 의사결정의 함정을 보완하기 위해 “Red Team” 전략을 사용하였습니다.

**집단 사고(Group Think)란?**

“ 집단 사고란 결속력이 높은 소수의 의사 결정 집단이 대안에 대한 분석과 이의 제기를 억제하면서 공동의 합의를 쉽게 이루려고 하는 왜곡된 사고 유형을 의미한다. ”

그래서 이를 경계해 보고자 한 가지 전략을 도입하게 되었습니다. “Red Team” 혹은 “악마의 대변인”이라고 불리는 전략으로, **일부러 반대 의견을 내보는 전략**입니다.

활용 예) 회의록에 동의하거나 동의하지 않는 내용이 추가되었습니다.

![레드팀 전략 예시](https://github.com/user-attachments/assets/adb0018c-940a-4fc5-bd2e-d212497d9c86)

덕분에 의사 결정 단계를 세분화하여 더욱 신중한 결정을 내리는 데 도움이 됐고, 밸런스를 맞춰가며 조율을 할 수 있게 됐습니다. 목적은 달성했지만 반대로 회의나 의사결정에 시간이 조금 더 든다는 부작용 때문에, 빠르게 체크하고 넘어가는 방향으로 추가 조율했습니다.

## 🔷 팀원 소개

![팀원 소개](https://github.com/user-attachments/assets/fb81e964-9c19-453b-a134-ed789a3290ab)
