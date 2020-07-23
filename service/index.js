var utils = require('utils');
var serand = require('serand');

var makes = {};
var models = {};

var cache = function (data) {
    data.forEach(function (model) {
        models[model.id] = model;
    });
};

var findOne = function (id, done) {
    $.ajax({
        method: 'GET',
        url: utils.resolve('apis:///v/vehicle-models/' + id),
        dataType: 'json',
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

var find = function (make, done) {
    utils.sync('model-vehicle-models:find', function (ran) {
        var next = utils.resolve('apis:///v/vehicle-models' + utils.toData({
            query: {
                make: make
            },
            count: 100
        }));
        utils.all(next, function (err, o) {
            if (err) {
                return ran(err);
            }
            cache(o);
            ran(null, _.sortBy(o, 'title'));
        });
    }, done);
};

exports.findOne = function (id, done) {
    if (models[id]) {
        return done(null, models[id]);
    }
    findOne(id, function (err) {
        if (err) {
            return done(err);
        }
        done(null, models[id]);
    });
};

exports.find = function (make, done) {
    if (makes[make]) {
        return done(null, makes[make]);
    }
    find(make, function (err, o) {
        if (err) {
            return done(err);
        }
        makes[make] = o;
        done(null, o);
    });
};
