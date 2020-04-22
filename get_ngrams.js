var methods = {
    get_ngrams: function(word) {
        data = [];
        const newword = '*' + word + '*';
        for (var i=0;i<newword.length-(2);i++) {
            data.push(newword.substring(i,i+3));
        }
        return data;
    }
}

exports.data = methods["get_ngrams"];
