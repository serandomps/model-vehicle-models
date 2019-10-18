var utils = require('utils');
var serand = require('serand');

var makes = {};
var models = {};

var process = function (data, done) {
    data.forEach(function (model) {
        models[model.id] = model;
        var o = makes[model.make] || (makes[model.make] = []);
        o.push(model);
    });
    done();
};

var find = function (make, done) {
    utils.sync('vehicle-models:find', function (ran) {
        var next = utils.resolve('autos:///apis/v/vehicle-models' + utils.data({
            query: {
                make: make
            },
            count: 100
        }));
        utils.all(next, function (err, o) {
            if (err) {
                return ran(err);
            }
            ran(null, _.sortBy(o, 'title'));
        });
    }, done);
};

exports.findOne = function (id, done) {
    if (models[id]) {
        return done(null, models[id]);
    }
    find(function (err) {
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
