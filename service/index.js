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

var find = function (done) {
    utils.sync('vehicle-models:find', function (ran) {
        $.ajax({
            method: 'GET',
            url: utils.resolve('autos:///apis/v/vehicle-models'),
            dataType: 'json',
            success: function (data) {
                process(data, ran);
            },
            error: function (xhr, status, err) {
                ran(err || status || xhr);
            }
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
    find(function (err) {
        if (err) {
            return done(err);
        }
        done(null, makes[make]);
    });
};
