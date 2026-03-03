# Supabase Integration

This project uses Supabase as the backend database.

## Setup

1. **Environment Variables** (Optional - for production):
   Create `.env` file:
   ```env
   SUPABASE_URL=https://vireabjnzjubdqpwfyrq.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   ```

2. **Initialize Database**:
   ```typescript
   import { database } from './src/data/storage/db';
   
   await database.init();
   ```

## Usage

### Authentication

```typescript
import { database } from './src/data/storage/db';

// Sign up
await database.signUp('user@example.com', 'password', 'username');

// Sign in
await database.signIn('user@example.com', 'password');

// Sign out
await database.signOut();

// Check auth status
const isAuth = await database.isAuthenticated();
```

### Database Operations

```typescript
import { supabase } from './src/data/storage/supabase';

// Fetch posts
const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });

// Create post
const { data, error } = await supabase
  .from('posts')
  .insert({
    owner_id: userId,
    message: 'Hello World',
    image_path: '/path/to/image.jpg',
    visibility: 'friends',
  });

// Update post
const { error } = await supabase
  .from('posts')
  .update({ like_count: 10 })
  .eq('id', postId);

// Delete post
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
```

### Realtime Subscriptions

```typescript
import { supabase } from './src/data/storage/supabase';

// Listen to new posts
const subscription = supabase
  .channel('posts')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'posts'
  }, (payload) => {
    console.log('New post:', payload.new);
  })
  .subscribe();

// Unsubscribe
subscription.unsubscribe();
```

## Database Schema

All database types are defined in `src/data/storage/types.ts`.
Domain models are in `src/domain/models/index.ts`.

### Main Tables

- **profiles**: User profiles
- **posts**: Main content (photos/videos with voice notes)
- **chapters**: Collections/albums of posts
- **post_comments**: Comments on posts
- **post_likes**: Likes on posts
- **friendships**: Friend connections
- **families**: Family groups
- **family_members**: Family membership
- **direct_messages**: Direct messages between users

## Type Safety

All Supabase operations are fully type-safe:

```typescript
import type { Database } from './src/data/storage/types';

// TypeScript knows the exact schema
type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];
```

## Migration

Previous local database schema has been migrated to Supabase.
Old interfaces in `src/data/storage/schema/` are deprecated.
Use models from `src/domain/models/` instead.
