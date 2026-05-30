             +----------------------+
             | VS Code REST Client  |
             | / Device Simulator   |
             +----------+-----------+
                        |
                        | POST /api/device/checkin
                        v
             +----------------------+
             | Node.js Express API  |
             +----------+-----------+
                        |
                        v
             +----------------------+
             | Device Check-In      |
             | Service              |
             +----------+-----------+
                        |
        +---------------+---------------+
        |               |               |
        v               v               v
+---------------+ +---------------+ +---------------+
| Compliance    | | Audit         | | Event Store   |
| Engine        | | Repository    | | Repository    |
+-------+-------+ +-------+-------+ +-------+-------+
        |                 |                 |
        v                 v                 v
+---------------+ +---------------+ +---------------+
| Device        | | Audit Events  | | Domain Events |
| Repository    | | In Memory     | | In Memory     |
| In Memory     | +---------------+ +---------------+
+---------------+
                        |
                        | GET APIs
                        v
             +----------------------+
             | React Dashboard      |
             +----------------------+