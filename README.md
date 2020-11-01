# land-th

สิ่งที่ต้องติดตั้ง:
- nodejs 14
- truffle

การพัฒนา:
1. สร้างไฟล์ `client/.env.local` ให้มีเนื้อหาดังนี้ (หากใช้ Docker ToolBox ให้เปลี่ยนจาก localhost เป็นไอพีของ vm):

  ```
  REACT_APP_SERVER_URI=http://localhost:5000
  ```

2. `npm install`
3. `docker-compose up`
4. `npm run migrate`
5. `npm run start`

การแก้ปัญหาเบื้องต้น:
- จะทำอย่างไร หากพบข้อความ "/app/src/contracts/LandTH.json loaded." แล้ว แต่ smart contract ไม่ทำงาน

  **ใช้คำสั่ง `docker-compose down -v` ลบโฟลเดอร์ _client/src/contracts_ และ _server/src/contracts_ จากนั้นจึงเริ่มการทำงานอีกครั้ง**

- เมื่อเพิ่มรูปแปลงแล้ว ได้รับแจ้งเตือนว่า Transaction Failed

  **ดู Revert reason ใน terminal**