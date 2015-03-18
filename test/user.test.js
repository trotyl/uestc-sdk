var assert = require('assert');
var _ = require('lodash');
var User = require('../src/user');
var UrlUtil = require('../src/urlutil');

describe('User ', function () {
    var user;

    beforeEach(function () {
        user = new User('2012019050020', '811073');
    });

    describe('#.ctor()', function () {
        it('should create the right object', function () {
            assert.equal('2012019050020', user._number_);
            assert.equal('811073', user._password_);
            assert.equal(User._status_.idle, user._status_);
            assert.equal(1, _.keys(user._jar_).length);
        });
    });

    describe('#__ensureLogin__()', function () {

        beforeEach(function () {
            user.__reset__();
        });

        it('should send ensure login when idle', function (done) {
            user.__ensureLogin__(UrlUtil.getEnsureLoginMeta(user)).nodeify(function () {
                assert.equal(User._status_.loginSuccess, user._status_);
                done();
            })
        });

        it('should send ensure login when login success', function (done) {
            user.__login__(UrlUtil.getUserLoginMeta('2012019050020', '811073')).nodeify(function () {
                user.__ensureLogin__(UrlUtil.getEnsureLoginMeta(user)).nodeify(function () {
                    assert.equal(User._status_.loginSuccess, user._status_);
                    done();
                })
            })
        });
    });

    describe('#__login__()', function () {
        var url, form;

        beforeEach(function () {
            url = 'https://uis.uestc.edu.cn/amserver/UI/Login';
            form = {
                'IDToken0': '',
                'IDToken1': '2012019050020',
                'IDToken2': '',
                'IDButton': 'Submit',
                'goto': 'aHR0cDovL3BvcnRhbC51ZXN0Yy5lZHUuY24vbG9naW4ucG9ydGFs',
                'encoded': true,
                'gx_charset': 'UTF-8'
            };
        });

        it('should send the post request and login success', function (done) {
            form['IDToken2'] = '811073';
            var meta = {
                url: url,
                jar: user._jar_,
                form: form
            };
            user.__login__(meta).nodeify(function (err, res) {
                assert.equal(false, !!err);
                done();
            });
       });

        it('should send the post request and login fail', function (done) {
            form['IDToken2'] = '811074';
            var meta = {
                url: url,
                jar: user._jar_,
                form: form
            };
            user.__login__(meta).nodeify(function (err, res) {
                assert.equal(true, !!err);
                done();
            });
        });
    });
});