# Cloud Storage Setup Guide

## Environment Variables

Add these environment variables to your `.env` file:

```env
# Cloud Storage API Configuration
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_API_KEY_FULL=value-bord
CLOUD_API_KEY_READ=value-site
```

## Migration from AWS S3

This project has been migrated from AWS S3 to a custom cloud storage API.

### Key Changes:

1. **File References**: Files are now referenced by UUID instead of S3 keys
2. **Upload Method**: Direct API uploads instead of pre-signed URLs
3. **File Access**: Files are served through proxy endpoint `/api/cloud/files/{fileId}`
4. **API Authentication**: Uses `X-API-Key` header instead of AWS credentials

### API Keys:

- **value-bord**: Full access (read, write, delete) - Used on backend only
- **value-site**: Read-only access - Used for file downloads

### File URL Format:

**Old S3 Format:**

```
https://d27wu6gy6te9ow.cloudfront.net/customers/uuid-filename.jpg
```

**New Cloud Storage Format:**

```
/api/cloud/files/{uuid}
```

### Database Updates:

If you're storing file URLs in your database, they should now store the file ID (UUID) or the proxy URL format.

**Example:**

```typescript
// Old
image_url: "https://cloudfront.net/customers/abc-123-image.jpg";

// New
image_url: "/api/cloud/files/550e8400-e29b-41d4-a716-446655440000";
// Or just store the ID
file_id: "550e8400-e29b-41d4-a716-446655440000";
```

### API Endpoints:

- **Upload**: `POST /api/cloud/upload`
- **Download**: `GET /api/cloud/files/{fileId}`
- **Delete**: Use `deleteCloudFile(fileId)` server action

### Usage Examples:

**Upload a file:**

```typescript
import { uploadFileToCloud } from "@/app/lib/cloud-storage";

const buffer = Buffer.from(await file.arrayBuffer());
const result = await uploadFileToCloud(buffer, file.name, file.type);
console.log(result.id); // File UUID
```

**Display an image:**

```tsx
<img src={`/api/cloud/files/${fileId}`} alt="..." />
```

**Delete a file:**

```typescript
import { deleteCloudFile } from "@/app/lib/cloud-storage";

await deleteCloudFile(fileId);
```

## Security Notes:

- ✅ API keys are stored in environment variables
- ✅ Full access key (`value-bord`) is only used on the backend
- ✅ Frontend uploads go through the proxy endpoint
- ✅ File downloads are proxied to hide API keys
- ❌ Never expose API keys in frontend code

## Testing:

Test the cloud storage connection:

```bash
curl -X GET "https://cloud.mirkokawa.dev/api/file/list?page=1&limit=5" \
  -H "X-API-Key: value-site"
```

Expected response:

```json
{
  "success": true,
  "data": {
    "files": [...],
    "pagination": {...}
  }
}
```
