// Service object
const BookmarkService = {
    getBookmarks(knex) {
        return knex
            .select('*')
            .from('bookmarks');
    },
    addBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmarks')
            .returning('*')
            .then(row =>
                row[0]);
    },
    getByID(knex, id) {
        return knex
            .select('*')
            .from('bookmarks')
            .where('id', id)
            .first();
    },
    updateBookmark(knex, id, updatedBookmark) {
        return knex('bookmarks')
            .where({id})
            .update(updatedBookmark);
    },
    removeBookmark(knex, id) {
        return knex('bookmarks')
            .where({id})
            .delete();
    }
};

module.exports = BookmarkService;