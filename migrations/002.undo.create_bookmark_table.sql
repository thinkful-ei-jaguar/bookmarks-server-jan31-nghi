ALTER TABLE bookmarks
    DROP COLUMN IF EXISTS rating;

DROP TYPE IF EXISTS rating_category;