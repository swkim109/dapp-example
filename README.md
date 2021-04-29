### 인프런 강좌 "블록체인 Dapp 이더리움_트랜잭션" 예제 프로젝트

Truffle 5.2.3 (core: 5.2.3)  
Solidity - 0.5.16 (solc-js)  
Node 14.16.1
Web3.js 1.2.9

### 실행방법

0. Truffle과 Ganache GUI가 미리 설치되어 있어야 합니다!  


1. 프로젝트를 로컬에 다운로드 하십시오.

   ```shell
   git clone https://github.com/swkim109/dapp-example.git
   ```

3. dapp-example 디렉토리로 이동하십시오.  


3. `truffle-config.js` 파일을 열어서 설정을 확인하십시오.   

   ```shell
   development: {host: "127.0.0.1", port: 7545, network_id: "5777"},
   ```

4. dapp-example 디렉토리에서 필요한 패키지를 설치하십시오.
   
   ```shell
   npm install
   ```
   
5. dapp-example\client 디렉토리에서 필요한 패키지를 설치하십시오.

   ```shell
   npm install
   ```

6. Ganache GUI(또는 ganache-cli)를 실행하십시오.  


7. 컨트랙트를 컴파일 하십시오.

   ```shell
   truffle compile
   ```

8. 컨트랙트를 Ganache에 배포하십시오. 

   ```shell
   truffle migrate
   ```

9. `send_u.js` 파일을 열어서 `to` 부분을 현재 메타마스크 지갑의 계정으로 변경하십시오.
   
   ```
   to: "0xAFc4F9F3bA806dd2F8e47A524fFDa2418bBFc08a",
   ```
   dapp-example 디렉토리에서 다음을 실행하십시오.

   ```shell
   truffle exec .\send_u.js
   ```

10. dapp-example 디렉토리에서 백엔드 서버를 실행하십시오.

   ```shell
   npm run start:dev   
   ```

11. dapp-example\client 디렉토리로 이동하여 프론트엔드 애플리케이션을 실행하십시오.

   ```shell
   npm run start
   ```

12. 웹 브라우저로 http://localhost:3000 에 연결하십시오.


13. 메타마스크의 네트워크를 Ganache로 변경하여 다시 접속하고 Dapp에 연결하십시오(미리 메타마스크에 Custom RPC로 Ganache가 추가되어 있어야 합니다).

### 서버측 서명 테스트에서 수정 사항

서버측 서명의 경우는 전자서명에 필요한 개인키를 설정해야 합니다. 

`\dapp-example\client\src\Main.js`을 열어서 다음을 수정하십시오.

```javascript
//TODO
// from 부분을 메타마스크의 계정으로 변경하십시오.
const result = await axios.post('/eth/setTx', {from: "0x6C1b...ca93", val: this.state.val});
```

`\dapp-example\src\api\eth\eth.controller.js` 을 열어서 다음을 수정하십시오.

```javascript
//TODO 메타마스크 계정의 개인키로 변경하십시오.
const privateKey = Buffer.from("5316...3027", "hex");
```



