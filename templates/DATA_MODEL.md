# DATA_MODEL.md

## Database Schema

### Overview
- **Database Type**: [PostgreSQL/MySQL/MongoDB/etc]
- **ORM/ODM**: [Prisma/TypeORM/Mongoose/etc]
- **Migration Tool**: [Tool name]

### Entity Relationship Diagram
```
User (1) -----> (*) Post
  |                  |
  |                  v
  +-------> (*) Comment
```

## Tables/Collections

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Posts Table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
```

## Application Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  profile?: UserProfile;
  posts?: Post[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
}
```

### Post Model
```typescript
interface Post {
  id: string;
  userId: string;
  user?: User;
  title: string;
  content?: string;
  status: 'draft' | 'published' | 'archived';
  tags?: Tag[];
  comments?: Comment[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Validation Rules

### User Validation
```javascript
const userSchema = {
  email: {
    type: 'email',
    required: true,
    maxLength: 255
  },
  username: {
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  password: {
    type: 'string',
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  }
};
```

## Common Queries

### User Queries
```sql
-- Get user with profile
SELECT u.*, p.*
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
WHERE u.id = $1;

-- Get active users
SELECT * FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20 OFFSET $1;
```

### Post Queries
```sql
-- Get published posts with author
SELECT p.*, u.username, u.email
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.status = 'published'
AND p.published_at <= NOW()
ORDER BY p.published_at DESC;

-- Get posts by tag
SELECT DISTINCT p.*
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE t.name = $1;
```

## Migrations

### Migration History
```bash
# List of applied migrations
001_create_users_table.sql
002_create_posts_table.sql
003_add_user_profiles.sql
004_add_post_tags.sql
```

### Creating Migrations
```bash
# Generate new migration
npm run migrate:create add_comments_table

# Run migrations
npm run migrate:up

# Rollback
npm run migrate:down
```

## Indexes and Performance

### Recommended Indexes
- User email lookup: `idx_users_email`
- Username lookup: `idx_users_username`
- Posts by user: `idx_posts_user_id`
- Posts by status: `idx_posts_status`
- Full-text search: `idx_posts_search`

### Query Optimization Tips
1. Always include appropriate WHERE clauses
2. Use LIMIT for pagination
3. Consider materialized views for complex queries
4. Monitor slow query logs

## Keywords <!-- #keywords -->
- database
- schema
- models
- migrations
- queries
- validation