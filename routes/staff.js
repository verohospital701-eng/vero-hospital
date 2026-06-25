const express = require('express');
const passport = require('passport');
const Staff = require('../models/staff');
const {
  isLoggedIn,
  getDashboardRoute,
  getStaffDashboardSections,
  getStaffDashboardView,
  getStaffDashboardPermissions,
  isStaffMember,
} = require('./helper');

const router = express.Router({ mergeParams: true });

router.get('/stafflogin', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('stafflogin', { data });
});

router.get('/staffregistration', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('staffregistration', { data });
});

router.get('/staffportal', (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  res.render('staffportal', { data });
});

router.get('/staffhome', isLoggedIn, isStaffMember, async (req, res) => {
  const data = {};
  data.user = req.user;
  data.NODE_ENV = process.env.NODE_ENV;
  data.sections = getStaffDashboardSections(req.user);
  data.permissions = getStaffDashboardPermissions(req.user);
  data.pendingUsers = [];

  if (req.user.usertype === 'admin' || req.user.role === 'Admin') {
    data.pendingUsers = await Staff.find({ status: 'Pending' }).lean();
  }

  const template = getStaffDashboardView(req.user);
  res.render(template, { data });
});

router.post('/stafflogin', (req, res, next) => {
  passport.authenticate('stafflocal', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/stafflogin');
    }
    return req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect(getDashboardRoute(req.user));
    });
  })(req, res, next);
});

router.post('/staffregistration', (req, res) => {
  const newStaff = new Staff({
    username: req.body.username,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    department: req.body.department,
    role: req.body.role,
    usertype: req.body.usertype || 'staff',
    status: req.body.usertype === 'admin' ? 'Pending' : 'Pending',
  });

  Staff.register(newStaff, req.body.password, (err, item) => {
    if (err) {
      console.log(err);
      const data = {};
      data.user = req.user;
      data.NODE_ENV = process.env.NODE_ENV;
      return res.render('staffregistration', { data });
    }
    return req.logIn(item, (loginErr) => {
      if (loginErr) {
        console.log(loginErr);
        return res.redirect('/stafflogin');
      }
      return res.redirect(getDashboardRoute(item));
    });
  });
});

router.post('/staff/approve/:id', isLoggedIn, async (req, res) => {
  if (req.user.usertype !== 'admin' && (req.user.role || '').toLowerCase() !== 'admin') {
    return res.status(403).send('Admin access required');
  }

  try {
    await Staff.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    return res.redirect('/staffhome');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to approve user');
  }
});

router.post('/staff/reject/:id', isLoggedIn, async (req, res) => {
  if (req.user.usertype !== 'admin' && (req.user.role || '').toLowerCase() !== 'admin') {
    return res.status(403).send('Admin access required');
  }

  try {
    await Staff.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
    return res.redirect('/staffhome');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Unable to reject user');
  }
});

module.exports = router;
