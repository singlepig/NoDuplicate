// delete duplicate bookmarks

var allBookmarks = [];
var allBookmarksTitle = [];
var duplicateCount = 0;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', function () {
        // do something when click the button
        no_duplicate();
    });
});

function no_duplicate() {
    chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        traverse_dir(bookmarkTreeNodes);
    });
}

function traverse_dir(bookmarkTreeNodes) {
    for (var i = 0; i < bookmarkTreeNodes.length; i++) {
        if (is_dir(bookmarkTreeNodes[i])) {
            // if this node is dir then traverse it
            var title = bookmarkTreeNodes[i].title;
            chrome.bookmarks.getChildren(bookmarkTreeNodes[i].id, function (nodes) {
                // console.log("bookmarkTreeNode " + title + " is dir, has " + nodes.length + " items");
                traverse_dir(nodes);
            });
        } else {
            // console.log("indexOf " + bookmarkTreeNodes[i].title);
            var index = allBookmarksTitle.indexOf(bookmarkTreeNodes[i].title);
            // console.log("result: " + index);
            if (index !== -1) {
                // already have the node with this title
                // console.log("count " + duplicateCount++);
                chrome.bookmarks.remove(bookmarkTreeNodes[i].id);
                // console.log("--- id: " + bookmarkTreeNodes[i].id);
                // console.log("--- title: " + bookmarkTreeNodes[i].title);
                // console.log("--- url: " + bookmarkTreeNodes[i].url);
                // console.log("=== title: " + allBookmarksTitle[index]);
            } else {
                allBookmarks.push(bookmarkTreeNodes[i]);
                allBookmarksTitle.push(bookmarkTreeNodes[i].title);
            }
        }
    }
    // console.log("you have " + allBookmarks.length + " bookmarks!");
}

function is_dir(bookmarkTreeNode) {
    // dir has no url
    return !bookmarkTreeNode.url;
}
