# land-th

สิ่งที่ต้องติดตั้ง:
- docker
- nodejs 14
- truffle

การพัฒนา:
1. [ติดตั้ง git-lfs][1]
1. `git lfs install`
1. `git lfs pull`
1. สร้างไฟล์ `.env.local` ให้มีเนื้อหาดังนี้ (หากใช้ Docker ToolBox ให้เปลี่ยนจาก localhost เป็นไอพีของ vm):

    ```
    BLOCKCHAIN_HOST=localhost
    ```

1. สร้างไฟล์ `client/.env.local` ให้มีเนื้อหาดังนี้ (หากใช้ Docker ToolBox ให้เปลี่ยนจาก localhost เป็นไอพีของ vm):

    ```
    REACT_APP_SERVER_URI=http://localhost:5000
    ```

1. สร้างไฟล์ `config/db.env` ให้มีเนื้อหาดังนี้

    ```
    POSTGRES_USER=yourusername
    POSTGRES_PASSWORD=yourpassword

    ```

1. `npm install`
1. `docker-compose up`
1. รอให้ blockchain เริ่มทำงาน
1. `npm run migrate`
1. `npm run start`

การแก้ปัญหาเบื้องต้น:
- จะทำอย่างไร หากพบข้อความ "/app/src/contracts/LandTH.json loaded." แล้ว แต่ smart contract ไม่ทำงาน

  **ใช้คำสั่ง `docker-compose down -v` ลบโฟลเดอร์ _client/src/contracts_ และ _server/src/contracts_ จากนั้นจึงเริ่มการทำงานอีกครั้ง**

- เมื่อเพิ่มรูปแปลงแล้ว ได้รับแจ้งเตือนว่า Transaction Failed

  **ดู Revert reason ใน terminal**

[1]: https://docs.github.com/en/free-pro-team@latest/github/managing-large-files/installing-git-large-file-storage
