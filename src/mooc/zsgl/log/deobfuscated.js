(self.webpackJsonpintelligent_portal = self.webpackJsonpintelligent_portal || []).push([[2368], {
  63340: function (a, b, c) {
    "use strict";

    var d = c(67294);
    var m = c.n(d);
    var f = c(87623);
    var g = c(52543);
    var h = c(5555);
    b.Z = function (i) {
      i.width;
      var b = i.height;
      var n = i.bottomText;
      var e = i.imgUrl;
      var j = i.loading;
      var a = 250;
      var c = (0, f.Z)({
        container: {
          position: "relative",
          width: "100%",
          height: b
        },
        inner: {
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: -145,
          marginLeft: -125,
          width: a,
          "& img": {
            width: a,
            height: a
          }
        },
        text: {
          fontSize: 14,
          color: "#999"
        }
      });
      var d = (0, g.Z)(c)(function (a) {
        var b = a.classes;
        var c = e ? `${h.EU}${e}` : `${h.EU}trainingClass/emptyContent.png`;
        if (j) {
          return m().createElement("div", {
            className: b.container
          });
        } else {
          return m().createElement("div", {
            className: b.container,
            id: "examResultDom"
          }, m().createElement("div", {
            className: b.inner
          }, m().createElement("img", {
            src: c
          }), m().createElement("div", {
            className: b.text
          }, n)));
        }
      });
      return m().createElement(d, null);
    };
  },
  45759: function (d, b, e) {
    "use strict";

    e.d(b, {
      Z: function () {
        return l;
      }
    });
    var n = e(27853);
    var g = e(84531);
    var a = e(51937);
    var h = e(13094);
    var f = e(67294);
    var i = e.n(f);
    var j = e(28122);
    e(57833);
    var c = e(67631);
    var k = e.n(c);
    var l = function (c) {
      (0, a.Z)(d, c);
      var e = (0, h.Z)(d);
      function d() {
        var f;
        (0, n.Z)(this, d);
        for (var g = arguments.length, a = new Array(g), c = 0; c < g; c++) {
          a[c] = arguments[c];
        }
        (f = e.call.apply(e, [this].concat(a))).video = null;
        f.player = undefined;
        f.state = {
          id: ""
        };
        f.getSource = function (a) {
          var b = a.playUrl;
          if (/(.mp4)|(.MP4)/.test(b)) {
            f.player.src(b);
            f.player.load();
          } else if (k().isSupported() && f.video) {
            var c = new (k())();
            c.loadSource(b);
            c.attachMedia(f.video);
            c.on(k().Events.MANIFEST_PARSED, function () {
              f.video.play();
            });
          }
        };
        return f;
      }
      (0, g.Z)(d, [{
        key: "componentWillMount",
        value: function () {
          this.setState({
            id: "id_" + Math.ceil(Math.random() * 1000)
          });
        }
      }, {
        key: "componentDidMount",
        value: function () {
          this.player = (0, j.Z)(`#${this.state.id}`, {
            preload: "none"
          });
          this.getSource(this.props);
        }
      }, {
        key: "componentWillReceiveProps",
        value: function (b) {
          if (this.props.playUrl !== b.playUrl) {
            this.getSource(b);
          }
          if (this.props.pauseVideo !== b.pauseVideo) {
            if (b.pauseVideo) {
              this.player.pause();
            } else {
              this.player.play();
            }
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function () {
          if (this.player) {
            this.player.pause();
          }
        }
      }, {
        key: "render",
        value: function () {
          var h = this;
          var b = this.props;
          var c = b.className;
          var d = c === undefined ? "" : c;
          var e = b.controls;
          var a = b.width;
          var f = b.height;
          return i().createElement("video", {
            id: this.state.id,
            ref: function (b) {
              return h.video = b;
            },
            controls: e,
            width: a,
            height: f,
            autoPlay: true,
            className: `${d} video-js vjs-default-skin vjs-big-play-centered`
          });
        }
      }]);
      return d;
    }(i().Component);
  },
  83057: function (Y, Z, e) {
    "use strict";

    var t = e(18489);
    var n = e(84322);
    var _ = e.n(n);
    var i = e(33032);
    var r = e(10522);
    var aa = e(18041);
    var a = e(58971);
    var s = e.n(a);
    var ba = e(63468);
    var c = e(71254);
    var l = "learn/app/clientapi/trainingclass/cloudschool/resourceReduceHours.do";
    var d = "learn/app/clientapi/trainingclass/cloudschool/isRemind.do";
    var m = "learn/app/clientapi/course/queryCourseDetail.do";
    var o = "learn/app/clientapi/course/queryStoreCourseDetail.do";
    var g = "learn/app/clientapi/course/commenthead.do";
    var f = "learn/app/clientapi/course/comment.do";
    var h = "learn/app/clientapi/course/commentLike.do";
    var p = "learn/app/clientapi/course/makecomment.do";
    var u = "learn/app/clientapi/course/commentOneList.do";
    var v = "learn/app/clientapi/course/uploadCourseLearnStatus.do";
    var w = "learn/app/clientapi/course/bigdata/courseLearnTime.do";
    var x = "learn/app/clientapi/course/bigdata/v2/courseLearnTime.do";
    var A = "learn/app/clientapi/course/uploadLearnFlag.do";
    var E = "learn/app/clientapi/course/courseRating.do";
    var b = "/learn/app/clientapi/course/queryCourseBaseInfo.do";
    var k = "learn/app/clientapi/course/clockin/validate.do";
    var y = "/learn/app/clientapi/trainingclass/cloudschool/selectResourceRule.do";
    var C = "learn/app/clientapi/trainingclass/training/item/selectResourceRule.do";
    var I = "learn/app/clientapi/user/isOpenHumanSocietyVas.do";
    var N = "learn/app/clientapi/trainingclass/training/item/queryRestrictDuration.do";
    var B = "/learn/app/clientapi/trainingclass/cloudschool/queryRestrictDuration.do";
    var R = "/learn/app/clientapi/trainingclass/training/item/check/queryTrainingCheckByEmp.do";
    var D = "/learn/app/clientapi/trainingclass/cloudschool/check/queryTrainingCheckByEmp.do";
    var L = "/learn/app/clientapi/trainingclass/training/item/getLearnSequenceCode.do";
    var q = "/learn/app/clientapi/course/play/queryStatus.do";
    var Q = "/learn/app/clientapi/course/progress/reportLearnProgress.do";
    var F = "/learn/app/clientapi/course/preview.do";
    var S = "/learn/app/clientapi/course/uploadCourseCompleted.do";
    var M = "/learn/app/clientapi/course/relatedResources.do";
    var O = "/learn/app/clientapi/exam/courseExam/insertExamVisible.do";
    var P = "/learn/app/clientapi/misc/queryVasOperation2NativeList.do";
    var z = "/learn/app/clientapi/course/recordCourseWareExamScore.do";
    var T = "/learn/app/clientapi/course/cview.do";
    var U = "/learn/app/clientapi/course/store/play.do";
    var G = "/learn/app/clientapi/course/getTokenByCode.do";
    var V = "/learn/app/clientapi/knowledgecloud/members/hasSpaceViewAuth.do";
    var J = "/learn/app/clientapi/knowledgecloud/members/hasPageViewAuth.do";
    var K = "/learn/app/clientapi/knowledgecloud/members/hasMapViewAuth.do";
    var H = "/learn/app/clientapi/knowledgecloud/space/leftMenusAll.do";
    var W = "/learn/app/clientapi/knowledgecloud/members/hasMorePageViewAuth.do";
    Z.Z = {
      deductCoursePeriod: function () {
        var c = (0, i.Z)(_().mark(function a(c) {
          return _().wrap(function (a) {
            for (;;) {
              switch (a.prev = a.next) {
                case 0:
                  return a.abrupt("return", r.Z.post(l, c, {
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8",
                      sid: aa.Z.sid
                    }
                  }));
                case 1:
                case "end":
                  return a.stop();
              }
            }
          }, a);
        }));
        return function (a) {
          return c.apply(this, arguments);
        };
      }(),
      checkFirstTimePlay: function () {
        var c = (0, i.Z)(_().mark(function a(e) {
          var f;
          return _().wrap(function (a) {
            for (;;) {
              switch (a.prev = a.next) {
                case 0:
                  a.next = 2;
                  return r.Z.get(d, {
                    params: {
                      trainingItemId: e
                    }
                  });
                case 2:
                  if ((f = a.sent).code !== 0) {
                    a.next = 5;
                    break;
                  }
                  return a.abrupt("return", f.body);
                case 5:
                case "end":
                  return a.stop();
              }
            }
          }, a);
        }));
        return function (a) {
          return c.apply(this, arguments);
        };
      }(),
      queryCourseDetail: function (c, a) {
        return r.Z.post(m, {
          courseId: c,
          trainingItemId: a,
          ver: ba.dM.VER
        });
      },
      queryBoughtCourseDetail: function (b) {
        return r.Z.post(o, {
          courseId: b
        });
      },
      getHeadComments: function (b) {
        return r.Z.post(g, {
          courseId: b,
          type: 0
        });
      },
      submitCourseRate: function (c, a) {
        return r.Z.get(E, {
          params: {
            courseId: c,
            rating: a
          }
        });
      },
      getComments: function (c, a) {
        return r.Z.post(f, {
          courseId: c,
          type: 0,
          curPage: a,
          numPerPage: 30
        });
      },
      markLike: function (b) {
        return r.Z.post(h, {
          likeType: 1,
          id: b,
          ver: ba.dM.VER
        });
      },
      getMoreSubComments: function (c, a) {
        return r.Z.get(u, {
          params: {
            commentId: c,
            curPage: a,
            numPerPage: 50
          }
        });
      },
      submitComment: function (f, b, c, d, e) {
        return r.Z.post(p, {
          courseId: f,
          comment: b,
          type: c,
          criticsBy: d,
          parentCommentId: e
        });
      },
      getCourseBaseInfo: function (c) {
        return r.Z.get(b, {
          params: {
            courseId: c
          },
          headers: {
            sid: aa.Z.getSid()
          }
        });
      },
      updateLearnTime: function (j, b, d, e, f, a) {
        var g = e - d;
        g = g > 60000 ? 60000 : g;
        var k = (s().get("sessionInfo") || {}).userId;
        var i = k === undefined ? "" : k;
        return r.Z.post(w, {
          courseId: j,
          coursewareId: b,
          startTime: d,
          endTime: e,
          duration: g,
          userId: i,
          trainingItemId: f,
          learnSessionId: a,
          terminalChannel: ba.dM.TERMINAL_CHANNEL
        });
      },
      updateLearnTimeV2: function (b, c, e, f, g, a, h) {
        var i = f - e;
        i = i > 60000 ? 60000 : i;
        var l = (s().get("sessionInfo") || {}).userId;
        var k = l === undefined ? "" : l;
        return r.Z.post(x, {
          courseId: b,
          coursewareId: c,
          startTime: e,
          endTime: f,
          duration: i,
          userId: k,
          trainingItemId: g,
          learnSessionId: a,
          terminalChannel: ba.dM.TERMINAL_CHANNEL,
          firstPlay: h
        }, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            sid: aa.Z.getSid()
          }
        });
      },
      markCourseFinish: function (c, a) {
        return r.Z.post(A, {
          courseId: c,
          trainingItemId: a
        });
      },
      beforeCourseLearnTime: function (c, a) {
        return r.Z.post(v, {
          courseId: c,
          coursewareId: a
        });
      },
      uploadCourseCompleted: function (c, a) {
        return r.Z.post(S, {
          duration: c,
          courseId: a
        }, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            sid: aa.Z.sid
          }
        });
      },
      courseValidate: function (b) {
        return r.Z.post(k, b, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            sid: aa.Z.sid
          }
        });
      },
      selectResourceRule: function (a, b, c, d) {
        return r.Z.get(d ? y : C, {
          params: {
            resourceId: a,
            resourceType: b,
            trainingItemId: c
          }
        });
      },
      getIsOpenHumanSocietyVas: function () {
        return r.Z.get(I, {});
      },
      queryRestrictDuration: function (c, a) {
        return r.Z.get(a ? B : N, {
          params: {
            trainingItemId: c
          }
        });
      },
      getScreenShotInfo: function (b) {
        return c.Z.post("/learn/app/clientapi/screenShot/queryScreenShotInfo.do", (0, t.Z)({
          userId: aa.Z.userId
        }, b));
      },
      getSpecialCheckId: function (f, b, c, d, e) {
        return r.Z.get(e ? D : R, {
          params: {
            resourceId: f,
            resourceType: b,
            trainingItemId: c,
            checkItemEndTag: d
          }
        });
      },
      getLearnSequenceCode: function (d, a, b) {
        return r.Z.get(L, {
          params: {
            trainingItemId: d,
            resourceId: a,
            resourceType: b
          }
        });
      },
      queryCourseStatus: function (b) {
        return r.Z.get(q, {
          params: b
        });
      },
      reportLearnProgress: function (b) {
        return r.Z.post(Q, (0, t.Z)((0, t.Z)({}, b), {}, {
          enterpriseId: aa.Z.enterpriseId
        }), {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            sid: aa.Z.sid
          }
        });
      },
      getCoursePlayUrl: function (b) {
        return r.Z.get(F, {
          params: {
            coursewareId: b
          }
        });
      },
      getAssociationTest: function (c, a) {
        return r.Z.get(M, {
          params: {
            courseId: c,
            type: a
          }
        });
      },
      getInsertExamVisible: function (c, a) {
        return r.Z.get(O, {
          params: {
            examId: c,
            courseId: a
          }
        });
      },
      queryVasOperation2NativeList: function (b) {
        return r.Z.get(P, {
          params: b
        });
      },
      getCoursePointPopup: function (b) {
        return r.Z.get("/learn/app/clientapi/point/getCoursePointPopup.do", {
          params: b
        });
      },
      recordCourseExamScoreApi: function (b) {
        return r.Z.post(z, (0, t.Z)((0, t.Z)({}, b), {}, {
          enterpriseId: aa.Z.enterpriseId
        }), {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            sid: aa.Z.sid
          }
        });
      },
      getTokenApi: function (b) {
        return r.Z.get(G, {
          params: b
        });
      },
      getEnterprisePlayUrl: function (c, a) {
        return r.Z.get(T, {
          params: {
            coursewareId: c,
            courseid: a,
            isJson: 1
          }
        });
      },
      getShopPlayUrl: function (c, a) {
        return r.Z.get(U, {
          params: {
            storeCoursewareId: c,
            storeCourseId: a,
            isJson: 1
          }
        });
      },
      hasSpaceViewAuth: function (b) {
        return r.Z.get(V, {
          params: {
            knowledgeSpaceId: b
          }
        });
      },
      hasPageViewAuth: function (b) {
        return r.Z.get(J, {
          params: {
            knowledgePageId: b
          }
        });
      },
      hasMapViewAuth: function (b) {
        return r.Z.get(K, {
          params: {
            mapId: b
          }
        });
      },
      getLeftMenu: function (b) {
        return r.Z.get(H, {
          params: {
            spaceId: b,
            isFirstLevel: 1
          }
        });
      },
      hasMorePageViewAuth: function (b) {
        return r.Z.get(W, {
          params: {
            knowledgePageId: b
          }
        });
      }
    };
  },
  91205: function (k, b, d) {
    "use strict";

    d.d(b, {
      d: function () {
        return a;
      },
      H: function () {
        return i;
      }
    });
    var e = d(84322);
    var l = d.n(e);
    var f = d(33032);
    var g = d(83057);
    var h = function () {
      var h = (0, f.Z)(l().mark(function c(e, b, d, f, a) {
        var h;
        return l().wrap(function (i) {
          for (;;) {
            switch (i.prev = i.next) {
              case 0:
                i.next = 2;
                return g.Z.getSpecialCheckId(e, b, d, 1, a);
              case 2:
                if ((h = i.sent) && h.code === 0 && typeof f === "function") {
                  f(h.body.isEnd);
                }
              case 4:
              case "end":
                return i.stop();
            }
          }
        }, c);
      }));
      return function (b, c, d, e, a) {
        return h.apply(this, arguments);
      };
    }();
    function a(f, b) {
      var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      var d = arguments.length > 3 ? arguments[3] : undefined;
      var e = arguments.length > 4 ? arguments[4] : undefined;
      h(f, b, c, d, e);
      return setInterval(function () {
        h(f, b, c, d, e);
      }, 30000);
    }
    function i(b) {
      clearInterval(b);
    }
  },
  62152: function (f, b, e) {
    "use strict";

    e.d(b, {
      Z: function () {
        return m;
      }
    });
    var h = e(84322);
    var t = e.n(h);
    var a = e(33032);
    var i = e(20042);
    var n = e(67294);
    var o = e.n(n);
    var j = e(52543);
    var q = e(20849);
    var c = e(87623);
    var k = e(37200);
    var l = e(87027);
    var d = e(63340);
    var p = e(69134);
    var m = (0, j.Z)(function (b) {
      return (0, c.Z)({
        certificateBox: {
          height: 500,
          padding: "50px 0 62px",
          position: "relative"
        },
        certificateImg: {
          height: 400,
          margin: "0 auto 40px",
          display: "block"
        },
        certificateBut: {
          width: 230,
          height: 48,
          background: b.palette.primary.main,
          margin: "0 auto",
          fontSize: 18,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 64
        }
      });
    })(function (h) {
      var c = h.classes;
      var r = h.setExamStage;
      var g = h.examId;
      var j = h.getExamBreakInfo;
      var s = h.changeLoading;
      var m = h.isFromResult;
      var f = (0, n.useState)("");
      var u = (0, i.Z)(f, 2);
      var v = u[0];
      var y = u[1];
      var x = (0, n.useState)(false);
      var w = (0, i.Z)(x, 2);
      var z = w[0];
      var b = w[1];
      (0, n.useEffect)(function () {
        s(true);
        A();
      }, []);
      var A = function () {
        var c = (0, a.Z)(t().mark(function a() {
          var d;
          return t().wrap(function (c) {
            for (;;) {
              switch (c.prev = c.next) {
                case 0:
                  c.prev = 0;
                  c.next = 3;
                  return q.Oe.queryExamCertificate(g);
                case 3:
                  d = c.sent;
                  b(true);
                  setTimeout(function () {
                    s(false);
                  }, 2000);
                  if (!d._failure) {
                    c.next = 8;
                    break;
                  }
                  return c.abrupt("return");
                case 8:
                  if (d.body && +d.code === 0) {
                    y(d.body);
                  }
                  c.next = 16;
                  break;
                case 11:
                  c.prev = 11;
                  c.t0 = c.catch(0);
                  b(true);
                  e.g.$message((0, p.vs)("network_anomaly"));
                  s(false);
                case 16:
                case "end":
                  return c.stop();
              }
            }
          }, a, null, [[0, 11]]);
        }));
        return function () {
          return c.apply(this, arguments);
        };
      }();
      return o().createElement("div", {
        className: c.certificateBox,
        style: {
          height: `${!v && z ? "400px" : "500px"}`
        }
      }, !!v && z && o().createElement("img", {
        src: `${v}`,
        alt: "",
        className: c.certificateImg
      }), !v && z && o().createElement(d.Z, {
        height: "300px",
        bottomText: (0, p.vs)("no_data_yet")
      }), o().createElement(l.Z, {
        loading: false,
        className: c.certificateBut,
        onClick: function () {
          if (m) {
            r(k.Bc.result);
          } else {
            r(k.Bc.info);
            j(false);
          }
        }
      }, (0, p.vs)("back")));
    });
  },
  41603: function (n, b, e) {
    "use strict";

    var j = e(84322);
    var k = e.n(j);
    var p = e(18489);
    var q = e(33032);
    var a = e(20042);
    var i = e(67294);
    var o = e.n(i);
    var c = e(52543);
    var r = e(37200);
    var l = e(20849);
    var m = e(91914);
    var s = e(87027);
    var X = e(33774);
    var d = e(58085);
    var g = e(63340);
    var f = e(69134);
    b.Z = (0, c.Z)(m.Z)(function (c) {
      var h = c.classes;
      var e = c.examId;
      var j = c.setExamStage;
      var m = c.examPaper;
      var v = c.isFromResult;
      var n = c.MAX_QUESTION_NUM;
      var A = c.detail;
      var t = c.getExamBreakInfo;
      var u = (0, i.useState)([]);
      var w = (0, a.Z)(u, 2);
      var x = w[0];
      var Z = w[1];
      var b = (0, i.useState)([]);
      var E = (0, a.Z)(b, 2);
      E[0];
      var C = E[1];
      var y = (0, i.useState)(0);
      var I = (0, a.Z)(y, 2);
      var N = I[0];
      var S = I[1];
      var B = (0, i.useState)(false);
      var R = (0, a.Z)(B, 2);
      var D = R[0];
      var L = R[1];
      var T = (0, i.useState)([[]]);
      var Q = (0, a.Z)(T, 2);
      var F = Q[0];
      var U = Q[1];
      (0, i.useEffect)(function () {
        if (v) {
          M();
        } else {
          z();
        }
      }, []);
      var M = function () {
        var a = (0, q.Z)(k().mark(function a() {
          var h;
          var i;
          var j;
          var n;
          return k().wrap(function (a) {
            for (;;) {
              switch (a.prev = a.next) {
                case 0:
                  L(true);
                  a.next = 3;
                  return l.Oe.queryErrorQuestionListByAttemptId(e, m.attemptId);
                case 3:
                  if (!(h = a.sent)._failure) {
                    a.next = 7;
                    break;
                  }
                  L(false);
                  return a.abrupt("return");
                case 7:
                  i = (h.body || []).map(function (b) {
                    return {
                      questionId: b.questionId,
                      questionNodeIds: b.questionNodesAnswer
                    };
                  });
                  C(i);
                  if (!(+h.code === 0 && (h.body || []).length > 0)) {
                    a.next = 15;
                    break;
                  }
                  j = h.body.map(function (b) {
                    return b.questionId;
                  });
                  n = h.body.map(function (a, b) {
                    return (0, p.Z)((0, p.Z)({}, a), {}, {
                      questionNo: b + 1,
                      myAnswer: a.answerList || [],
                      sortNo: b + 1,
                      myAnswerList: a.questionNodesAnswer.map(function (a, b) {
                        return (0, p.Z)((0, p.Z)({}, a), {}, {
                          questionNo: b + 1,
                          answerList: a.answerList || []
                        });
                      })
                    });
                  });
                  Z(n);
                  a.next = 15;
                  return W(j, i);
                case 15:
                  L(false);
                case 16:
                case "end":
                  return a.stop();
              }
            }
          }, a);
        }));
        return function () {
          return a.apply(this, arguments);
        };
      }();
      var O = function b(d, e) {
        d.forEach(function (c) {
          e.push(c.questionId);
          if (c.questionNodeIds && c.questionNodeIds.length > 0) {
            b(c.questionNodeIds, e);
          }
        });
        return e;
      };
      function P(d, a) {
        var e = [];
        (a && a.length > 0 ? a : m.questionNodeResp).forEach(function (a) {
          if (d.includes(a.questionId)) {
            O(a.questionNodeIds, e);
          }
        });
        return {
          questionIds: d,
          questionNodeIds: e
        };
      }
      var z = function () {
        var a = (0, q.Z)(k().mark(function a() {
          var g;
          var h;
          var i;
          return k().wrap(function (a) {
            for (;;) {
              switch (a.prev = a.next) {
                case 0:
                  L(true);
                  a.next = 3;
                  return l.Oe.queryErrorQuestionListByExamId(e);
                case 3:
                  if (!(g = a.sent)._failure) {
                    a.next = 7;
                    break;
                  }
                  L(false);
                  return a.abrupt("return");
                case 7:
                  C(g.body || []);
                  if (!(+g.code === 0 && g.body && g.body.length > 0)) {
                    a.next = 14;
                    break;
                  }
                  h = g.body.map(function (b) {
                    return b.questionId;
                  });
                  i = g.body.map(function (d, a) {
                    return {
                      questionId: d.questionId,
                      questionNo: a + 1,
                      answerList: [],
                      sortNo: a + 1,
                      myAnswerList: (b = d.questionNodesAnswer, b && b.length ? b.map(function (c, a) {
                        return {
                          answerList: [],
                          questionNo: a + 1,
                          questionId: c
                        };
                      }) : [])
                    };
                    var b;
                  });
                  Z(i.map(function (a) {
                    return (0, p.Z)((0, p.Z)({}, a), {}, {
                      question: {}
                    });
                  }));
                  a.next = 14;
                  return W(h, g.body);
                case 14:
                  L(false);
                case 15:
                case "end":
                  return a.stop();
              }
            }
          }, a);
        }));
        return function () {
          return a.apply(this, arguments);
        };
      }();
      var W = function () {
        var d = (0, q.Z)(k().mark(function a(e, b) {
          var c;
          return k().wrap(function (d) {
            for (;;) {
              switch (d.prev = d.next) {
                case 0:
                  c = [Y(e, b)];
                  d.next = 3;
                  return Promise.all(c);
                case 3:
                case "end":
                  return d.stop();
              }
            }
          }, a);
        }));
        return function (a, b) {
          return d.apply(this, arguments);
        };
      }();
      var Y = function () {
        var d = (0, q.Z)(k().mark(function a(e, b) {
          var c;
          return k().wrap(function (d) {
            for (;;) {
              switch (d.prev = d.next) {
                case 0:
                  if (!(e.length > n)) {
                    d.next = 6;
                    break;
                  }
                  c = G(e);
                  d.next = 4;
                  return V(c[0], b);
                case 4:
                  d.next = 8;
                  break;
                case 6:
                  d.next = 8;
                  return V(e, b);
                case 8:
                case "end":
                  return d.stop();
              }
            }
          }, a);
        }));
        return function (a, b) {
          return d.apply(this, arguments);
        };
      }();
      function G(d) {
        var a = [];
        if (d && d.length > n) {
          for (var b = 0; b < d.length; b += n) {
            a.push(d.slice(b, b + n));
          }
          U(a);
        }
        return a;
      }
      var V = function () {
        var d = (0, q.Z)(k().mark(function c(a, b) {
          var d;
          var f;
          var j;
          return k().wrap(function (g) {
            for (;;) {
              switch (g.prev = g.next) {
                case 0:
                  d = P(a, b);
                  f = d.questionNodeIds;
                  g.next = 3;
                  return l.Oe.queryQuestionDetail(e, a, f);
                case 3:
                  if (!(j = g.sent)._failure) {
                    g.next = 6;
                    break;
                  }
                  return g.abrupt("return", false);
                case 6:
                  if (+j.code !== 0 || !j.body) {
                    g.next = 10;
                    break;
                  }
                  console.log(j.body);
                  Z(function (a) {
                    return a.map(function (d) {
                      var a = j.body.find(function (b) {
                        return b.questionId === d.questionId;
                      });
                      if (a) {
                        return (0, p.Z)((0, p.Z)((0, p.Z)({}, d), a), {}, {
                          question: (0, p.Z)({}, a)
                        });
                      } else {
                        return d;
                      }
                    });
                  });
                  return g.abrupt("return", j.body);
                case 10:
                case "end":
                  return g.stop();
              }
            }
          }, c);
        }));
        return function (b, a) {
          return d.apply(this, arguments);
        };
      }();
      var J = x[N] || {};
      var K = function () {
        var d = (0, q.Z)(k().mark(function a(b, c) {
          var d;
          return k().wrap(function (e) {
            for (;;) {
              switch (e.prev = e.next) {
                case 0:
                  if (x[b].questionText) {
                    e.next = 6;
                    break;
                  }
                  L(true);
                  d = F.findIndex(function (c) {
                    return c.find(function (c) {
                      return c === x[b].questionId;
                    });
                  });
                  e.next = 5;
                  return V(F[d > -1 ? d : 0]);
                case 5:
                  L(false);
                case 6:
                  if (typeof c === "function") {
                    c();
                  }
                case 7:
                case "end":
                  return e.stop();
              }
            }
          }, a);
        }));
        return function (a, b) {
          return d.apply(this, arguments);
        };
      }();
      if (D) {
        return o().createElement(d.Z, null);
      }
      return o().createElement(o().Fragment, null, o().createElement("div", {
        className: h.goback,
        onClick: function () {
          if (v) {
            j(r.Bc.result);
          } else {
            j(r.Bc.info);
            t(false);
          }
        }
      }, "< ", (0, f.vs)("back")), x.length > 0 ? o().createElement(o().Fragment, null, o().createElement("div", {
        className: h.top
      }, o().createElement("div", {
        className: h.topLeft
      }, o().createElement("div", {
        className: h.subjectNum
      }, o().createElement("span", {
        className: h.currentSubject
      }, N + 1), o().createElement("span", {
        className: h.totalSubject
      }, "/", x.length)), o().createElement("div", {
        className: h.subjectType
      }, r.tX[J.questionType || ""]))), o().createElement(X.Z, {
        isViewErrorQuestions: true,
        isFromResult: v,
        currentIndex: N,
        currentSubject: J,
        detail: A
      }), x && x.length > 1 && o().createElement("div", {
        className: h.manipulate
      }, N === 0 && o().createElement("div", {
        className: h.buttonDisabled
      }, (0, f.vs)("examDetail_previous")), N !== 0 && o().createElement(s.Z, {
        loading: false,
        className: h.manipulateBtn,
        onClick: function () {
          K(N - 1, function () {
            return S(N - 1);
          });
        }
      }, (0, f.vs)("examDetail_previous")), N !== x.length - 1 && o().createElement(s.Z, {
        loading: false,
        className: `${h.manipulateBtn} ${h.next}`,
        onClick: function () {
          K(N + 1, function () {
            return S(N + 1);
          });
        }
      }, (0, f.vs)("examDetail_next")), N === x.length - 1 && o().createElement("div", {
        className: `${h.buttonDisabled} ${h.next}`
      }, (0, f.vs)("examDetail_next")))) : o().createElement(g.Z, {
        height: "600px",
        bottomText: (0, f.vs)("examDetail_no_mistake")
      }));
    });
  },
  55979: function (j, B, e) {
    "use strict";

    e.d(B, {
      Z: function () {
        return sa;
      }
    });
    var D = e(52470);
    var n = e(65658);
    var G = e(18489);
    var H = e(84322);
    var J = e.n(H);
    var N = e(33032);
    var ba = e(20042);
    var ca = e(67294);
    var l = e.n(ca);
    var i = e(26709);
    var c = e(30553);
    var d = e(13258);
    var m = e(16218);
    var p = e(59816);
    var a = e(52543);
    var g = e(96486);
    var u = e(37200);
    var h = e(20849);
    var f = e(91914);
    var s = e(87027);
    var v = e(66045);
    var o = e(89472);
    var E = e(91155);
    var b = e(256);
    var S = e(69134);
    var k;
    var r;
    var K;
    var R;
    var T;
    var da;
    var ea = (0, a.Z)(b.Z)(function (b) {
      var c = b.classes;
      var i = b.visible;
      var e = b.closeDialog;
      var j = b.setCurrentIndex;
      var k = b.questionAnswers;
      var m = b.submitExam;
      var a = b.onChangeQuestionNo;
      var n = b.timeLimitState;
      var d = (0, ca.useState)(false);
      var p = (0, ba.Z)(d, 2);
      var r = p[0];
      var g = p[1];
      var f = (0, ca.useState)(false);
      var h = (0, ba.Z)(f, 2);
      var s = h[0];
      var t = h[1];
      var w = (0, ca.useState)(false);
      var x = (0, ba.Z)(w, 2);
      var y = x[0];
      var A = x[1];
      var C = (0, ca.useState)([]);
      var H = (0, ba.Z)(C, 2);
      var B = H[0];
      var I = H[1];
      var D = (0, ca.useState)([]);
      var R = (0, ba.Z)(D, 2);
      var q = R[0];
      var K = R[1];
      (0, ca.useEffect)(function () {
        L();
      }, [k]);
      function F(a, b) {
        if (b.length) {
          return true;
        }
        if (a.length < 1) {
          return false;
        }
        var c;
        var d = 0;
        var h = (0, o.Z)(a);
        try {
          for (h.s(); !(c = h.n()).done;) {
            if (!c.value) {
              d++;
            }
          }
        } catch (b) {
          h.e(b);
        } finally {
          h.f();
        }
        return d !== a.length;
      }
      function L() {
        var d = [];
        var a = [];
        k.map(function (b) {
          if (n) {
            if (b.done) {
              a.push(b);
            } else {
              d.push(b);
            }
          } else if (!function (h) {
            var b = h.answerList;
            var c = h.questionNodesAnswer;
            var d = c === undefined ? [] : c;
            var e = h.images;
            var i = e === undefined ? [] : e;
            var a = d.length;
            if (d && d.length) {
              return a > d.filter(function (b) {
                if (b.questionNodesAnswer && b.questionNodesAnswer.length) {
                  return b.questionNodesAnswer.every(function (b) {
                    return F(b.answerList || [], i);
                  });
                } else {
                  return F(b.answerList, i);
                }
              }).length;
            } else {
              return !F(b, i);
            }
          }(b)) {
            a.push(b);
          } else {
            d.push(b);
          }
        });
        I(a);
        K(d);
        if (k && d && d.length > 0) {
          A(true);
        } else {
          A(false);
        }
      }
      function M(d, b) {
        if (!(b && b === "no" && n)) {
          e();
          a(d - 1, function () {
            j(d - 1);
          }, "end");
        }
      }
      function T() {
        e();
        g(true);
      }
      function O() {
        e();
        if (!n) {
          if (q && q[0] && q[0].questionNo) {
            M(q[0].questionNo);
          }
        }
      }
      var z = function () {
        var b = (0, N.Z)(J().mark(function b() {
          return J().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  t(true);
                  b.next = 3;
                  return m(u.Bc.result, "end");
                case 3:
                  t(false);
                  g(false);
                case 5:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      var P = l().createElement(l().Fragment, null, l().createElement("h5", {
        className: c.dialogTitle
      }, (0, S.vs)("examDetail_exam_total", {
        total: q.length + B.length
      })), l().createElement("div", {
        className: c.dialogContent
      }, l().createElement("div", null, l().createElement("p", {
        className: c.numberTitle
      }, (0, S.vs)("examDetail_not_answer"), q.length), l().createElement("ul", {
        className: c.numberUl
      }, q && q.map(function (d, a) {
        return l().createElement("li", {
          className: c.numberNo,
          key: d.questionId,
          onClick: function () {
            return M(d.questionNo || 0, "no");
          },
          style: {
            cursor: n ? "default" : "pointer"
          }
        }, d.questionNo);
      }))), l().createElement("div", {
        style: {
          marginTop: `${q.length === 0 ? "20px" : 0}`
        }
      }, l().createElement("p", {
        className: `${c.numberTitle} ${q.length ? `${c.numberTitleMargin}` : ""}`
      }, (0, S.vs)("examDetail_answered"), B.length), l().createElement("ul", {
        className: c.numberUl
      }, B && B.map(function (d, a) {
        return l().createElement("li", {
          className: `${c.numberNo} ${c.numberYes}`,
          key: d.questionId,
          onClick: function () {
            return M(d.questionNo || 0, "yes");
          }
        }, d.questionNo);
      })))));
      var Q = y ? l().createElement("div", {
        className: c.twoContent
      }, (0, S.vs)("examDetail_hasNoAnswer", {
        questionAnswers: k.length,
        yesArr: B.length,
        noArr: q.length
      })) : l().createElement("div", {
        className: c.twoContent
      }, (0, S.vs)("examDetail_all_complete", {
        questionAnswers: k.length
      }));
      return l().createElement(l().Fragment, null, l().createElement(v.Z, {
        onCancel: function () {
          if (y) {
            T();
          } else {
            O();
          }
        },
        onOk: function () {
          if (y) {
            O();
          } else {
            T();
          }
        },
        visible: i,
        content: P,
        confirmAndCancel: true,
        classes: {
          paper: (0, E.w1)() ? c.paperIe : c.paper
        },
        okText: y ? (0, S.vs)("examDetail_go_back_continue") : (0, S.vs)("examDetail_submit_exam_page"),
        cancelText: y ? (0, S.vs)("examDetail_submit_exam_page") : (0, S.vs)("cancel")
      }), l().createElement(v.Z, {
        loading: s,
        onCancel: function () {
          if (q && q[0] && q[0].questionNo) {
            M(q[0].questionNo);
          }
          if (s) {
            t(false);
          }
          g(false);
        },
        onOk: z,
        visible: r,
        content: Q,
        confirmAndCancel: true,
        classes: {
          paper: c.twoPaper
        },
        okText: (0, S.vs)("examDetail_submit_exam_page"),
        cancelText: (0, S.vs)("cancel")
      }));
    });
    var fa = e(60722);
    var L = e(46327);
    var q = e(33774);
    var Q = (0, a.Z)({
      remainTime: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 212,
        height: 34,
        backgroundColor: "#FFF4E5",
        color: "#FBB050",
        fontSize: 16
      }
    })(function (m) {
      var b = m.classes;
      var e = m.remainTime;
      var f = m.countTimeEnd;
      var g = (0, ca.useState)(e > 0 ? e : 0);
      var a = (0, ba.Z)(g, 2);
      var h = a[0];
      var i = a[1];
      (0, ca.useEffect)(function () {
        r = e;
        if (e > 0) {
          j();
        } else {
          f(e < -600);
        }
        return function () {
          clearInterval(k);
        };
      }, [e]);
      function j() {
        k = setInterval(function () {
          if (r > 0) {
            i(function (b) {
              return b - 1;
            });
            r--;
          } else {
            clearInterval(k);
            f(false);
          }
        }, 1000);
      }
      function n(b) {
        if (b < 10) {
          return `0${b}`;
        } else {
          return b;
        }
      }
      function c(a) {
        var b = Math.floor(a / 3600);
        var c = Math.floor(a / 60 % 60);
        var d = a % 60;
        return `${n(b)}:${n(c)}:${n(d)}`;
      }
      if (e <= 0) {
        return l().createElement("div", {
          className: b.remainTime
        }, (0, S.vs)("examDetail_remaining_time"), c(0));
      } else {
        return l().createElement("div", {
          className: b.remainTime
        }, (0, S.vs)("examDetail_remaining_time"), c(h));
      }
    });
    var F = e(64229);
    var ga = (0, a.Z)(F.Z)(function (m) {
      var b = m.classes;
      var e = m.questionNum;
      var f = m.autoSubmitExam;
      var g = m.networkState;
      var a = (0, ca.useState)(5);
      var h = (0, ba.Z)(a, 2);
      var i = h[0];
      var j = h[1];
      (0, ca.useEffect)(function () {
        var b = Math.floor(Math.random() * 5) + 5;
        R = b;
        k();
        return function () {
          clearInterval(K);
        };
      }, []);
      function k() {
        j(function () {
          return R;
        });
        K = setInterval(function () {
          if (R > 0) {
            j(function (b) {
              return b - 1;
            });
            R--;
          } else {
            f();
            clearInterval(K);
          }
        }, 1000);
      }
      var c = l().createElement("div", {
        className: b.ManipulateDialogContent
      }, (0, S.vs)("examDetail_time_over", {
        questionNum: e
      }));
      return l().createElement(l().Fragment, null, l().createElement(v.Z, {
        onOk: f,
        visible: true,
        userClose: true,
        content: c,
        okText: (0, S.vs)("examDetail_continue_submit", {
          time: i
        }),
        networkState: g
      }));
    });
    var C = e(91205);
    var M = e(50124);
    var O = ["questionIdList", "questionNodeResp"];
    var z = [];
    var U = true;
    var ha = [];
    var nc = 0;
    var oc = 0;
    var V = false;
    var X = false;
    var Y = 0;
    var Z = 1;
    var _ = false;
    var aa = false;
    var sa = (0, a.Z)(f.Z)(function (r) {
      var a = r.classes;
      var A = r.examPaper;
      var b = r.answers;
      var j = r.questionDetails;
      var F = r.remainTime;
      var k = r.isInvigilate;
      var o = r.setExamStage;
      var w = r.setExamPaper;
      var x = r.setExamResultObj;
      var t = r.setAllAnswers;
      var f = r.onChangeQuestionNo;
      var y = r.currentIndex;
      var B = r.setCurrentIndex;
      var I = r.isFromResult;
      var P = r.detail;
      var H = r.setRemainTime;
      var W = r.getExamBreakInfo;
      var K = r.loadingState;
      var ia = r.examId;
      var R = r.trainingItemId;
      var ja = r.limitSize;
      var ka = r.cutScreenInfo;
      var la = (0, ca.useState)(false);
      var ma = (0, ba.Z)(la, 2);
      var na = ma[0];
      var oa = ma[1];
      var pa = (0, ca.useState)([]);
      var qa = (0, ba.Z)(pa, 2);
      var ra = qa[0];
      var sa = qa[1];
      var ta = (0, ca.useState)(false);
      var ua = (0, ba.Z)(ta, 2);
      var va = ua[0];
      var wa = ua[1];
      var xa = (0, ca.useState)(false);
      var ya = (0, ba.Z)(xa, 2);
      var za = ya[0];
      var Aa = ya[1];
      var Ba = (0, ca.useState)(false);
      var Ca = (0, ba.Z)(Ba, 2);
      var Da = Ca[0];
      var Ea = Ca[1];
      var Fa = (0, ca.useState)(0);
      var Ga = (0, ba.Z)(Fa, 2);
      var Ha = Ga[0];
      var Ia = Ga[1];
      var Ja = (0, ca.useState)(0);
      var Ka = (0, ba.Z)(Ja, 2);
      var La = Ka[0];
      var Ma = Ka[1];
      var Na = (0, ca.useState)(false);
      var Oa = (0, ba.Z)(Na, 2);
      var Pa = Oa[0];
      var Qa = Oa[1];
      var Ra = (0, ca.useState)(false);
      var Sa = (0, ba.Z)(Ra, 2);
      var Ta = Sa[0];
      var Ua = Sa[1];
      var Va = (0, ca.useState)(false);
      var Wa = (0, ba.Z)(Va, 2);
      var Xa = Wa[0];
      var Ya = Wa[1];
      var Za = (0, ca.useState)(false);
      var $a = (0, ba.Z)(Za, 2);
      var _a = $a[0];
      var ab = $a[1];
      var bb = (0, ca.useState)(false);
      var cb = (0, ba.Z)(bb, 2);
      var db = cb[0];
      var eb = cb[1];
      var fb = (0, ca.useState)("");
      var gb = (0, ba.Z)(fb, 2);
      var hb = gb[0];
      var ib = gb[1];
      var jb = (0, ca.useState)((0, S.vs)("confirm"));
      var kb = (0, ba.Z)(jb, 2);
      var lb = kb[0];
      var mb = kb[1];
      var nb = (0, ca.useState)(false);
      var ob = (0, ba.Z)(nb, 2);
      var pb = ob[0];
      var qb = ob[1];
      var rb = (0, ca.useState)(Object);
      var sb = (0, ba.Z)(rb, 2);
      var tb = sb[0];
      var ub = sb[1];
      var vb = (0, ca.useState)(false);
      var wb = (0, ba.Z)(vb, 2);
      var xb = wb[0];
      var yb = wb[1];
      var zb = (0, ca.useState)(false);
      var Ab = (0, ba.Z)(zb, 2);
      var Bb = Ab[0];
      var Cb = Ab[1];
      var Db = (0, ca.useState)(false);
      var Eb = (0, ba.Z)(Db, 2);
      var Fb = Eb[0];
      var Gb = Eb[1];
      var Hb = (0, ca.useState)(0);
      var Ib = (0, ba.Z)(Hb, 2);
      var Jb = Ib[0];
      var Kb = Ib[1];
      var Lb = (0, i.k6)();
      var Mb = K.nextLoading;
      var Nb = K.upLoading;
      var Ob = K.questionLoading;
      var Pb = K.setTypeLoding;
      (0, ca.useEffect)(function () {
        var b;
        if (A.examId) {
          b = (0, C.d)(ia, 30, R, jc);
        }
        window.onbeforeunload = function () {
          (0, C.H)(b);
        };
        return function () {
          (0, C.H)(b);
        };
      }, [A]);
      (0, ca.useEffect)(function () {
        oc = y;
        if (y > nc) {
          nc = y;
        }
      }, [y]);
      (0, ca.useEffect)(function () {
        V = Pa;
      }, [Pa]);
      (0, ca.useEffect)(function () {
        X = _a;
      }, [_a]);
      (0, ca.useEffect)(function () {
        U = true;
        da = 0;
        ha = [];
        nc = 0;
        oc = 0;
        return function () {
          if (P && P.isTimeLimit === u.hn.YES) {
            ha = [];
            nc = 0;
            oc = 0;
            if (T) {
              da = 0;
              fc();
            }
          }
        };
      }, []);
      (0, ca.useEffect)(function () {
        ha = b;
      }, [b]);
      (0, ca.useEffect)(function () {
        if (P && P.isTimeLimit === u.hn.YES) {
          Ea(true);
        }
      }, [P]);
      (0, ca.useEffect)(function () {
        if (P && P.isTimeLimit === u.hn.YES && j && j[y] && j[y].question && j[y].question.questionType && ha && ha[y] && !ha[y].done) {
          var b = j[y].question.questionType;
          dc(b);
        }
      }, [P, j, y]);
      (0, ca.useEffect)(function () {
        z = [];
        if (k && A.questionIdList) {
          Rb(A.questionIdList.length);
          setTimeout(function () {
            webcam.capture();
          }, 3000);
        }
      }, [A]);
      (0, ca.useEffect)(function () {
        (function () {
          if (F.remainSeconds) {
            var g = F.remainSeconds;
            var b = P.autoSubmitDate;
            var c = P.isAutoSubmit;
            var d = new Date(b).getTime() - new Date().getTime();
            var e = Math.floor(d / 1000);
            var a = c && e < g ? e : g;
            if (a <= 0 && c) {
              bc(false);
              return;
            }
            Kb(a);
          }
        })();
      }, [P, F]);
      var Qb = function () {
        var c = (0, N.Z)(J().mark(function a(e) {
          var b;
          var c;
          var i;
          return J().wrap(function (d) {
            for (;;) {
              switch (d.prev = d.next) {
                case 0:
                  b = (0, E.xG)();
                  c = {
                    businessType: u.$8.Exam,
                    resourceId: e,
                    userId: b.sessionInfo && b.sessionInfo.userId
                  };
                  d.next = 4;
                  return h.Oe.reportOnScreen(c);
                case 4:
                  i = d.sent;
                  _ = true;
                  if (+i.code === 0) {
                    d.next = 8;
                    break;
                  }
                  return d.abrupt("return");
                case 8:
                  ub(i.body);
                  Z = i.body.remainderTimes;
                  qb(true);
                case 11:
                case "end":
                  return d.stop();
              }
            }
          }, a);
        }));
        return function (a) {
          return c.apply(this, arguments);
        };
      }();
      (0, ca.useEffect)(function () {
        var a = window.outerWidth + 10 >= screen.availWidth && window.outerHeight + 10 >= screen.availHeight;
        var e = window.navigator.userAgent.toLocaleLowerCase();
        var c = e.indexOf("wxwork") > -1;
        var d = Number(e.split("chrome/")[1].split(".")[0]);
        if (e.includes("mac") && e.includes("chrome") && d > 110) {
          a = true;
        }
        if (c) {
          a = true;
        }
        Z = 1;
        if (!P || P.isFlipScreen === u.iK.Open) {
          if (ka && ka.maxTimes) {
            yb(true);
            if (!a) {
              Gb(true);
            }
            window.onblur = function () {
              Y = Date.now();
              aa = false;
            };
            window.onfocus = function () {
              var a = window.outerWidth + 10 >= screen.availWidth && window.outerHeight + 10 >= screen.availHeight;
              var e = window.navigator.userAgent.toLocaleLowerCase();
              var c = e.indexOf("wxwork") > -1;
              var d = Number(e.split("chrome/")[1].split(".")[0]);
              if (e.includes("mac") && e.includes("chrome") && d > 110) {
                a = true;
              }
              if (c) {
                a = true;
              }
              if (a) {
                if (aa) {
                  return;
                }
                if (Date.now() - Y <= 2000) {
                  return;
                }
                Cb(false);
                Gb(false);
                Qb(ia);
              } else {
                if (Z === 0) {
                  return;
                }
                Gb(true);
                Cb(true);
                yb(false);
                Qb(ia);
                aa = true;
              }
            };
            window.onresize = function () {
              var a = window.outerWidth + 10 >= screen.availWidth && window.outerHeight + 10 >= screen.availHeight;
              var e = window.navigator.userAgent.toLocaleLowerCase();
              var c = e.indexOf("wxwork") > -1;
              var d = Number(e.split("chrome/")[1].split(".")[0]);
              if (e.includes("mac") && e.includes("chrome") && d > 110) {
                a = true;
              }
              if (c) {
                a = true;
              }
              if (a) {
                Cb(false);
                _ = false;
                Gb(false);
              } else {
                if (Z === 0) {
                  return;
                }
                Gb(true);
                Cb(true);
                yb(false);
                if (!_) {
                  Qb(ia);
                }
              }
            };
            return;
          } else {
            return undefined;
          }
        }
      }, [ka]);
      function Rb(a) {
        var b = [];
        if (a <= 4) {
          for (var c = ha.length; c < a; c++) {
            b.push(c);
          }
          sa(b);
        } else {
          b.push(Math.floor(Math.random() * a) + 1);
          for (var g = 0; g < 3; g++) {
            for (var h = Math.floor(Math.random() * a); b.indexOf(h) > -1 || h <= ha.length;) {
              h = Math.floor(Math.random() * a);
            }
            b.push(h);
          }
          sa(b);
        }
      }
      var Sb = j[y] || {};
      function Tb(a, b, c) {
        t(function (d) {
          return d.map(function (d) {
            if ((0, g.findIndex)(a, function (b) {
              return b.questionId === d.questionId;
            }) > -1) {
              return (0, G.Z)((0, G.Z)({}, d), {}, {
                done: c === undefined ? d.done : c,
                hasSubmit: b
              });
            } else {
              return d;
            }
          });
        });
      }
      var Ub = function () {
        var f = (0, N.Z)(J().mark(function c(l, b, d, a) {
          var f;
          var m;
          var o;
          return J().wrap(function (a) {
            for (;;) {
              switch (a.prev = a.next) {
                case 0:
                  f = true;
                  m = {};
                  a.prev = 2;
                  if (!d) {
                    a.next = 9;
                    break;
                  }
                  a.next = 6;
                  return h.Oe.submitQuestionAnswer(l);
                case 6:
                  m = a.sent;
                  a.next = 12;
                  break;
                case 9:
                  a.next = 11;
                  return h.Oe.submitQuestionAnswerNext(l);
                case 11:
                  m = a.sent;
                case 12:
                  U = true;
                  a.next = 20;
                  break;
                case 15:
                  a.prev = 15;
                  a.t0 = a.catch(2);
                  if (!(d || b !== 1)) {
                    e.g.$message((0, S.vs)("network_anomaly"));
                  }
                  f = false;
                  U = false;
                case 20:
                  if ((!m || !m._failure && +m.code === 0) && f) {
                    a.next = 24;
                    break;
                  }
                  f = true;
                  if (b === 1) {
                    z = (0, g.uniqBy)([].concat((0, n.Z)(z), (0, n.Z)(l)), "questionId");
                    Tb(l, false);
                  }
                  return a.abrupt("return", false);
                case 24:
                  if (!m.body || m.code !== 0) {
                    a.next = 28;
                    break;
                  }
                  Tb(l, true, true);
                  if (z.length) {
                    o = l.map(function (b) {
                      return b.questionId;
                    });
                    z = z.filter(function (b) {
                      return !o.includes(b.questionId);
                    });
                  }
                  return a.abrupt("return", true);
                case 28:
                  return a.abrupt("return", false);
                case 29:
                case "end":
                  return a.stop();
              }
            }
          }, c, null, [[2, 15]]);
        }));
        return function (b, c, d, e) {
          return f.apply(this, arguments);
        };
      }();
      var Vb = function () {
        var f = (0, N.Z)(J().mark(function d(f, a, b, c) {
          var h;
          var i;
          var j;
          var k;
          var l;
          return J().wrap(function (m) {
            for (;;) {
              switch (m.prev = m.next) {
                case 0:
                  h = [];
                  A.questionIdList;
                  A.questionNodeResp;
                  i = (0, D.Z)(A, O);
                  j = ha[y];
                  k = 20;
                  l = false;
                  if (!a) {
                    m.next = 15;
                    break;
                  }
                  if (!((h = b === "auto" ? (0, g.uniqBy)([].concat((0, n.Z)(z), [(0, G.Z)((0, G.Z)({}, i), {}, {
                    answerList: j && j.answerList,
                    questionId: Sb.questionId,
                    images: j && j.images || []
                  })]), "questionId") : (0, g.uniqBy)((0, n.Z)(z), "questionId")).length < 1)) {
                    m.next = 12;
                    break;
                  }
                  if (c && typeof c === "function") {
                    c(true);
                  }
                  return m.abrupt("return", true);
                case 12:
                  if (h.length > k) {
                    h = h.slice(0, k);
                    l = true;
                  }
                case 13:
                  m.next = 19;
                  break;
                case 15:
                  if (!(j === null || j === undefined ? undefined : j.hasSubmit)) {
                    m.next = 18;
                    break;
                  }
                  if (c && typeof c === "function") {
                    c(true);
                  }
                  return m.abrupt("return", true);
                case 18:
                  h = [(0, G.Z)((0, G.Z)({}, i), {}, {
                    answerList: j && j.answerList,
                    questionId: Sb.questionId,
                    questionNodesAnswer: j && j.questionNodesAnswer,
                    images: j && j.images || [],
                    answerList4Blank: j && j.answerList4Blank || []
                  })];
                case 19:
                  m.next = 21;
                  return Ub(h, f, a, b);
                case 21:
                  if (!m.sent) {
                    m.next = 33;
                    break;
                  }
                  if (!l) {
                    m.next = 31;
                    break;
                  }
                  z.splice(0, k);
                  l = false;
                  m.next = 28;
                  return Vb(3, a, b, c);
                case 28:
                  return m.abrupt("return", m.sent);
                case 31:
                  if (c && typeof c === "function") {
                    c(true);
                  }
                  return m.abrupt("return", true);
                case 33:
                  if (f > 1) {
                    setTimeout((0, N.Z)(J().mark(function e() {
                      return J().wrap(function (e) {
                        for (;;) {
                          switch (e.prev = e.next) {
                            case 0:
                              e.next = 2;
                              return Vb(f - 1, a, b, c);
                            case 2:
                              return e.abrupt("return", e.sent);
                            case 3:
                            case "end":
                              return e.stop();
                          }
                        }
                      }, e);
                    })), 2000);
                  } else {
                    if (c && typeof c === "function") {
                      c(false);
                    }
                    if (a) {
                      e.g.$message((0, S.vs)("examDetail_submit_failed"));
                    }
                  }
                  return m.abrupt("return", false);
                case 35:
                case "end":
                  return m.stop();
              }
            }
          }, d);
        }));
        return function (b, c, d, e) {
          return f.apply(this, arguments);
        };
      }();
      var Wb = function () {
        var c = (0, N.Z)(J().mark(function a(g) {
          var b;
          var c;
          return J().wrap(function (d) {
            for (;;) {
              switch (d.prev = d.next) {
                case 0:
                  if (k) {
                    Yb(y);
                  }
                  b = {};
                  d.prev = 2;
                  d.next = 5;
                  return h.Oe.submitNewExamPaper({
                    attemptId: A.attemptId,
                    examId: A.examId,
                    testNo: A.testNo,
                    trainingItemId: R
                  });
                case 5:
                  b = d.sent;
                  d.next = 12;
                  break;
                case 8:
                  d.prev = 8;
                  d.t0 = d.catch(2);
                  e.g.$message((0, S.vs)("examDetail_submit_failed"));
                  return d.abrupt("return", false);
                case 12:
                  if (!b._failure) {
                    d.next = 20;
                    break;
                  }
                  if (+b.code !== 15200022) {
                    d.next = 16;
                    break;
                  }
                  if (P.isAutoSubmit) {
                    Lb.goBack();
                  }
                  return d.abrupt("return", false);
                case 16:
                  o(u.Bc.info);
                  d.next = 19;
                  return W(false);
                case 19:
                case 25:
                  return d.abrupt("return", false);
                case 20:
                  if (+b.code !== 0 || !b.body) {
                    d.next = 25;
                    break;
                  }
                  c = b.body;
                  if (g === u.Bc.result) {
                    x({
                      score: c.score,
                      markingStatus: c.markingStatus,
                      status: c.status,
                      pointNum: c.pointNum,
                      isSubmit: true
                    });
                    o(u.Bc.result);
                  } else {
                    o(g);
                  }
                  w(function (b) {
                    return (0, G.Z)((0, G.Z)({}, b), {}, {
                      attemptId: c.attemptId
                    });
                  });
                  return d.abrupt("return", true);
                case 26:
                case "end":
                  return d.stop();
              }
            }
          }, a, null, [[2, 8]]);
        }));
        return function (a) {
          return c.apply(this, arguments);
        };
      }();
      function Xb() {
        if (za) {
          Aa(false);
        }
        var b = Da ? oc + 1 : y + 1;
        if (Da) {
          if (!Xa) {
            Qa(false);
          }
          if (oc === nc && T) {
            fc();
          }
          ec(false);
        } else {
          f(b, function () {
            return Vb(3, false, "next");
          }, "next");
        }
        if (k) {
          Yb(b - 1);
        }
      }
      function Yb(c) {
        var a = ra.indexOf(c);
        if (a > -1) {
          webcam.capture();
          ra.splice(a, 1);
        }
      }
      function Zb(l, h, d, b, e, g) {
        if (ha[y] && ha[y].answerList.length >= 0) {
          t(function (a) {
            return a.map(function (a) {
              if (a.questionId === Sb.questionId) {
                if (l === u.ce.LINE && e) {
                  return (0, G.Z)((0, G.Z)({}, a), {}, {
                    images: b || [],
                    hasSubmit: false,
                    answerList: e
                  });
                }
                if (l === u.ce.CASE_ANALYSIS) {
                  var c = Sb.question.newQuestionNodes;
                  var m = c === undefined ? [] : c;
                  var f = a.questionNodesAnswer.map(function (a, b) {
                    if (a.questionId === g) {
                      var c = m[b].questionType;
                      return (0, G.Z)((0, G.Z)({}, a), {}, {
                        answerList: c === u.ce.SINGLE || a.answerList.length < 1 ? [h] : a.answerList.find(function (b) {
                          return b === h;
                        }) ? a.answerList.filter(function (b) {
                          return b !== h;
                        }) : [].concat((0, n.Z)(a.answerList), [h])
                      });
                    }
                    return a;
                  });
                  return (0, G.Z)((0, G.Z)({}, a), {}, {
                    images: b || [],
                    hasSubmit: false,
                    questionNodesAnswer: f
                  });
                }
                if (l === u.ce.READ) {
                  var i = a.questionNodesAnswer.map(function (a, b) {
                    if (a.questionId === g) {
                      return (0, G.Z)((0, G.Z)({}, a), {}, {
                        answerList: [h]
                      });
                    }
                    if (a.questionNodesAnswer) {
                      var c = a.questionNodesAnswer.map(function (b) {
                        console.log("childQues", b);
                        if (b.questionId === g) {
                          return (0, G.Z)((0, G.Z)({}, b), {}, {
                            answerList: [h]
                          });
                        } else {
                          return b;
                        }
                      });
                      return (0, G.Z)((0, G.Z)({}, a), {}, {
                        questionNodesAnswer: c
                      });
                    }
                    return a;
                  });
                  return (0, G.Z)((0, G.Z)({}, a), {}, {
                    answerList: [],
                    images: b || [],
                    hasSubmit: false,
                    questionNodesAnswer: i
                  });
                }
                if (l === u.ce.FILL_IN_BLANK && d) {
                  return (0, G.Z)((0, G.Z)({}, a), {}, {
                    answerList: d,
                    hasSubmit: false,
                    answerList4Blank: Sb.question.sectionRespList.map(function (c, a) {
                      return {
                        sectionId: c.sectionId,
                        answer: d[a]
                      };
                    })
                  });
                } else {
                  return (0, G.Z)((0, G.Z)({}, a), {}, {
                    images: b || [],
                    hasSubmit: false,
                    answerList: l === u.ce.SINGLE || a.answerList.length < 1 ? [h] : a.answerList.find(function (b) {
                      return b === h;
                    }) ? a.answerList.filter(function (b) {
                      return b !== h;
                    }) : [].concat((0, n.Z)(a.answerList), [h])
                  });
                }
              }
              return a;
            });
          });
        }
      }
      var $b = function () {
        var b = (0, N.Z)(J().mark(function b() {
          return J().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  b.next = 2;
                  return Vb(3, false, "scantron");
                case 2:
                  oa(true);
                case 3:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      var _b = function () {
        var d = (0, N.Z)(J().mark(function b(d, a) {
          return J().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  b.next = 2;
                  return Vb(3, true, a);
                case 2:
                  if (!b.sent) {
                    b.next = 9;
                    break;
                  }
                  b.next = 6;
                  return Wb(d);
                case 6:
                  window.onblur = null;
                  window.onfocus = null;
                  window.onresize = null;
                case 9:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function (a, b) {
          return d.apply(this, arguments);
        };
      }();
      var ac = function () {
        var b = (0, N.Z)(J().mark(function b() {
          return J().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  b.next = 2;
                  return _b(u.Bc.result, "auto");
                case 2:
                  if (U) {
                    wa(false);
                  }
                case 3:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      function bc(b) {
        if (b) {
          var c = l().createElement("div", {
            className: a.beyondDeadlineContent
          }, (0, S.vs)("examDetail_overtime"));
          e.g.$confirm({
            visible: true,
            onOk: function () {
              var c = (0, N.Z)(J().mark(function a(c) {
                return J().wrap(function (a) {
                  for (;;) {
                    switch (a.prev = a.next) {
                      case 0:
                        a.next = 2;
                        return _b(u.Bc.info, "auto");
                      case 2:
                        if (U) {
                          c(false);
                          W(false);
                        }
                      case 3:
                      case "end":
                        return a.stop();
                    }
                  }
                }, a);
              }));
              return function (a) {
                return c.apply(this, arguments);
              };
            }(),
            content: c,
            userClose: true
          });
        } else {
          oa(false);
          wa(true);
        }
        H({
          recognitionStatus: null,
          remainSeconds: null
        });
      }
      var cc = l().createElement("div", {
        className: a.timeLimitDialogBox
      }, l().createElement("div", {
        className: a.timeLimitText
      }, (0, S.vs)("examDetail_next_step")), l().createElement(c.Z, {
        control: l().createElement(d.Z, {
          icon: l().createElement(m.Z, {
            fontSize: "small"
          }),
          checkedIcon: l().createElement(p.Z, {
            fontSize: "small"
          }),
          checked: Ta,
          onChange: function (b) {
            Ua(b.target.checked);
          },
          inputProps: {
            "aria-label": "primary checkbox"
          },
          color: "primary"
        }),
        label: (0, S.vs)("examDetail_not_prompt_again"),
        classes: {
          label: a.timeLimitLabel
        }
      }));
      function dc(d) {
        if (T) {
          clearInterval(T);
        }
        var a;
        var e = (0, g.find)(P.timeLimitArr, ["questionType", d]);
        a = e && e.limitTime || 0;
        da = a;
        Ia(a);
        Ma(a);
        T = setInterval((0, N.Z)(J().mark(function b() {
          return J().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  if (!(da > 0)) {
                    b.next = 6;
                    break;
                  }
                  Ma(da - 1);
                  da--;
                  b.next = 17;
                  break;
                case 6:
                  clearInterval(T);
                  Ma(0);
                  if (da !== 0) {
                    b.next = 17;
                    break;
                  }
                  if (oc !== j.length - 1) {
                    b.next = 13;
                    break;
                  }
                  ec(true);
                  b.next = 17;
                  break;
                case 13:
                  if (oc === j.length - 1 || oc !== nc) {
                    b.next = 17;
                    break;
                  }
                  if (!V && !X) {
                    b.next = 16;
                    break;
                  }
                  return b.abrupt("return");
                case 16:
                  ec(false);
                case 17:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        })), 1000);
      }
      function ec(b) {
        Aa(false);
        Pb(true, "next");
        Vb(3, false, "next", function (a) {
          if (a) {
            if (!b) {
              f(oc + 1, "", "next");
            }
            Pb(false, "next");
          } else {
            Pb(false, "next");
          }
        });
      }
      function fc() {
        clearInterval(T);
        Ma(0);
        da = 0;
      }
      function gc() {
        return `${(1 - (La === 0 ? La : La - 1) / (Ha === 0 ? Ha : Ha - 1)) * 100}%`;
      }
      function hc() {
        return Da && ha && ha[y] && (!ha[y].done || ha[y].done && oc === nc && T && da > 0);
      }
      function ic() {
        eb(false);
        window.opener = null;
        window.open("", "_self");
        window.close();
      }
      var jc = function () {
        var c = (0, N.Z)(J().mark(function a(e) {
          var b;
          var c;
          return J().wrap(function (d) {
            for (;;) {
              switch (d.prev = d.next) {
                case 0:
                  if (!e) {
                    d.next = 11;
                    break;
                  }
                  eb(true);
                  ib((0, S.vs)("about_to_quit"));
                  mb((0, S.vs)("examDetail_determine"));
                  b = 15;
                  c = setInterval(function () {
                    if (--b === 0) {
                      clearInterval(c);
                      ic();
                    }
                    mb((0, S.vs)("countdown", {
                      countNum: b
                    }));
                  }, 1000);
                  fc();
                  d.next = 9;
                  return Vb(3, true, "end");
                case 9:
                  d.next = 11;
                  return h.Oe.submitNewExamPaper({
                    attemptId: A.attemptId,
                    examId: A.examId,
                    testNo: A.testNo,
                    trainingItemId: R
                  });
                case 11:
                case "end":
                  return d.stop();
              }
            }
          }, a);
        }));
        return function (a) {
          return c.apply(this, arguments);
        };
      }();
      var kc = function () {
        var b = (0, N.Z)(J().mark(function b() {
          return J().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  qb(false);
                  if (!tb || tb.remainderTimes !== 0) {
                    b.next = 4;
                    break;
                  }
                  b.next = 4;
                  return _b(u.Bc.result, "auto");
                case 4:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      return l().createElement(l().Fragment, null, l().createElement("div", {
        className: a.top
      }, l().createElement("div", {
        className: a.topLeft
      }, l().createElement("div", {
        className: a.subjectNum
      }, l().createElement("span", {
        className: a.currentSubject
      }, Sb.questionNo), l().createElement("span", {
        className: a.totalSubject
      }, "/", j.length)), l().createElement("div", {
        className: a.subjectType
      }, Sb.question ? u.tX[Sb.question.questionType || ""] : ""), hc() && l().createElement("div", {
        className: a.timeLimit
      }, l().createElement("img", {
        src: L,
        alt: "",
        className: a.timeLimitIcon
      }), l().createElement("span", null, (0, S.vs)("examDetail_time_limit", {
        nowLimitTime: La
      }))), Da && ha && ha[y] && ha[y].done && (oc !== nc || oc === nc && da < 1) && l().createElement("div", {
        className: a.timeLimitDisabled
      }, (0, S.vs)("examDetail_unchangeable"))), hc() && l().createElement(l().Fragment, null, l().createElement("div", {
        className: a.timeProgress,
        style: {
          width: gc(),
          transition: gc() !== "0%" ? "width 1s linear" : ""
        }
      }), l().createElement("div", {
        className: a.timeProgressLine
      })), l().createElement("div", {
        className: a.topRight
      }, !!Jb && l().createElement(Q, {
        remainTime: Jb,
        countTimeEnd: bc
      }), l().createElement("div", {
        className: a.submitExamBtn,
        onClick: $b
      }, l().createElement("img", {
        className: a.submitIcon,
        src: fa
      }), l().createElement("div", {
        className: a.submitExam
      }, (0, S.vs)("examDetail_submit_exam_page"))))), Sb && Sb.question && (Sb.question.sectionRespList || Sb.question.newQuestionNodes) && l().createElement(q.Z, {
        changeViewAnswerTipsState: function (b) {
          Aa(b);
        },
        viewAnswerTipsState: za,
        currentIndex: y,
        currentSubject: Sb.question,
        currentLength: j.length,
        answerList: function (h, b) {
          if (!h.length) {
            return [];
          }
          if (!h[b]) {
            return [];
          }
          var c = h[b];
          var d = c.answerList;
          var e = d === undefined ? [] : d;
          var a = c.questionNodesAnswer;
          var f = a === undefined ? [] : a;
          if (f.some(function (b) {
            return b.questionNodesAnswer && b.questionNodesAnswer.length;
          })) {
            return f;
          } else if (e.length > 0) {
            return e;
          } else {
            return f.map(function (b) {
              return b.answerList;
            });
          }
        }(b, y),
        images: b[y] && b[y].images || [],
        onSelectOption: function (h, b, c, d) {
          var e = "";
          var i = "";
          var j = Sb.question.questionType;
          if (typeof h === "string") {
            e = h;
          }
          if (typeof h === "object") {
            e = h.sectionId;
            i = h.childId;
          }
          if (!(j !== u.ce.SINGLE && j !== u.ce.JUDGE && j !== u.ce.QUESTION_ANSWER && j !== u.ce.ATTACMENT)) {
            Zb(u.ce.SINGLE, e, undefined, c);
          }
          if (!(j !== u.ce.MULTIPLE && j !== u.ce.IMAGE)) {
            Zb(u.ce.MULTIPLE, e);
          }
          if (j === u.ce.FILL_IN_BLANK) {
            Zb(u.ce.FILL_IN_BLANK, e, b);
          }
          if (j === u.ce.LINE) {
            Zb(u.ce.LINE, e, undefined, undefined, d);
          }
          if (j === u.ce.CASE_ANALYSIS) {
            Zb(u.ce.CASE_ANALYSIS, e, undefined, undefined, undefined, i);
          }
          if (j === u.ce.GROUP_SINGLE) {
            Zb(u.ce.CASE_ANALYSIS, e, undefined, undefined, undefined, i);
          }
          if (j === u.ce.READ) {
            Zb(u.ce.READ, e, undefined, undefined, undefined, i);
          }
        },
        setOperateVisible: ab,
        isViewErrorQuestions: false,
        isFromResult: I,
        detail: P,
        disabled: Da && ha && ha[y] && (ha[y].done && oc !== nc || oc === nc && da < 1),
        limitSize: ja
      }), A && A.questionIdList && A.questionIdList.length > 1 && l().createElement("div", {
        className: a.manipulate
      }, y === 0 && l().createElement("div", {
        className: a.buttonDisabled
      }, (0, S.vs)("examDetail_previous")), y !== 0 && l().createElement(s.Z, {
        loading: Nb,
        className: a.manipulateBtn,
        onClick: function () {
          if (za) {
            Aa(false);
          }
          f(y - 1, function () {
            return Vb(3, false, "up");
          }, "up");
        }
      }, (0, S.vs)("examDetail_previous")), y !== j.length - 1 && l().createElement(s.Z, {
        loading: Ob || Mb,
        className: `${a.manipulateBtn} ${a.next}`,
        onClick: function () {
          if (za) {
            Aa(false);
          }
          if (Da) {
            if (!Xa && hc()) {
              Qa(true);
              return;
            }
            if (Xa && oc === nc && T) {
              fc();
            }
          }
          Xb();
        }
      }, (0, S.vs)("examDetail_next")), y === j.length - 1 && l().createElement("div", {
        className: `${a.buttonDisabled} ${a.next}`
      }, (0, S.vs)("examDetail_next"))), l().createElement(ea, {
        onChangeQuestionNo: f,
        visible: na,
        closeDialog: function () {
          oa(false);
        },
        setCurrentIndex: B,
        questionAnswers: b,
        submitExam: _b,
        timeLimitState: Da
      }), Da && l().createElement(v.Z, {
        onCancel: function () {
          Qa(false);
        },
        onOk: function () {
          if (Ta) {
            Ya(true);
          }
          Qa(false);
          fc();
          Xb();
        },
        visible: Pa,
        content: cc,
        confirmAndCancel: true
      }), va && l().createElement(ga, {
        questionNum: A.questionIdList.length,
        autoSubmitExam: ac,
        networkState: U
      }), l().createElement(v.Z, {
        visible: db,
        content: hb,
        onOk: ic,
        okText: lb,
        contentStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }), l().createElement(v.Z, {
        visible: pb,
        footer: l().createElement("div", {
          className: a.dialogFooter
        }, l().createElement(M.Z, {
          disabled: Bb,
          type: "button",
          className: Bb ? a.searchBtn : "",
          onClick: function () {
            return kc();
          }
        }, (0, S.vs)("i_got_it")))
      }, l().createElement("div", {
        className: a.warningText
      }, (0, S.vs)("warning")), tb && tb.remainderTimes > 0 ? l().createElement("div", null, (0, S.vs)("cheating_times", {
        maxTimes: tb.maxTimes - tb.remainderTimes,
        remainderTimes: tb.remainderTimes
      })) : l().createElement("div", null, (0, S.vs)("cut_screen_maxTimes", {
        maxTimes: tb && tb.maxTimes
      }))), l().createElement(v.Z, {
        visible: xb,
        footer: l().createElement("div", {
          className: a.dialogFooter
        }, l().createElement(M.Z, {
          disabled: Fb,
          type: "button",
          className: Fb ? a.searchBtn : "",
          onClick: function () {
            yb(false);
          }
        }, (0, S.vs)("i_got_it")))
      }, l().createElement("div", {
        className: a.warningText
      }, (0, S.vs)("warning")), l().createElement("div", null, (0, S.vs)("cut_screen_times", {
        maxTimes: ka && ka.maxTimes
      }))));
    });
  },
  13730: function (a, j, e) {
    "use strict";

    e.d(j, {
      Z: function () {
        return G;
      }
    });
    var H;
    var y = e(84322);
    var t = e.n(y);
    var N = e(33032);
    var r = e(20042);
    var _ = e(67294);
    var aa = e.n(_);
    var s = e(30381);
    var J = e.n(s);
    var c = e(52543);
    var l = e(40053);
    var m = e(67246);
    var o = e(44568);
    var p = e(51406);
    var U = e(91155);
    var g = e(87623);
    var K = e(48623);
    var h = e(50124);
    var ba = e(87027);
    var ca = e(69134);
    var V = (0, c.Z)(function (b) {
      return (0, g.Z)({
        paper: {
          display: "flex",
          alignItems: "center",
          width: 570,
          height: 296
        },
        title: {
          width: 430,
          marginTop: 70,
          fontSize: 22,
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          wordWrap: "break-word",
          wordBreak: "normal",
          overflowWrap: "break-word"
        },
        content: {
          width: 380,
          marginTop: 14,
          fontSize: 16,
          color: "#666",
          wordWrap: "break-word",
          wordBreak: "normal",
          overflowWrap: "break-word"
        },
        footer: {
          display: "flex",
          justifyContent: "space-between",
          width: 380,
          marginTop: 40
        },
        dialogBtn: {
          width: 170
        },
        cancel: {
          backgroundColor: "#fff",
          color: b.palette.primary.main,
          border: `1px solid ${b.palette.primary.main}`,
          "&:hover": {
            backgroundColor: "#fff"
          }
        }
      });
    })(function (m) {
      var b = m.classes;
      var d = m.visible;
      var e = m.title;
      var f = m.content;
      var a = m.children;
      var g = m.okText;
      var i = m.cancelText;
      var j = m.onOk;
      var k = m.onCancel;
      var c = m.loading;
      return aa().createElement(K.Z, {
        open: d,
        disableBackdropClick: true,
        classes: {
          paper: b.paper
        }
      }, aa().createElement("div", {
        className: b.title
      }, e), aa().createElement("div", {
        className: b.content
      }, f || a), aa().createElement("div", {
        className: b.footer
      }, aa().createElement(h.Z, {
        className: `${b.dialogBtn} ${b.cancel}`,
        onClick: k
      }, i || (0, ca.vs)("cancel")), aa().createElement(ba.Z, {
        className: b.dialogBtn,
        loading: c || false,
        onClick: j
      }, g || (0, ca.vs)("confirm"))));
    });
    var I = e(20849);
    var b = e(75572);
    var d = e(32475);
    (function (b) {
      b[b.takePhoto = 0] = "takePhoto";
      b[b.uploadFaceImg = 1] = "uploadFaceImg";
      b[b.identification = 2] = "identification";
    })(H || (H = {}));
    var f;
    var i = 0;
    var W = (0, c.Z)(function (b) {
      return (0, g.Z)({
        paper: {
          display: "flex",
          alignItems: "center",
          width: 570,
          height: 498
        },
        title: {
          marginTop: 50,
          marginBottom: 40,
          fontSize: 22,
          fontWeight: "bold",
          color: "#333"
        },
        identification: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 320,
          marginTop: 40,
          marginBottom: 20
        },
        passTitle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        },
        passIcon: {
          width: 24,
          height: 24,
          marginRight: 6
        },
        passText: {
          fontSize: 22,
          color: "#333"
        },
        recordSuccess: {
          marginTop: 8,
          fontSize: 16,
          color: "#666"
        },
        content: {
          position: "relative",
          width: 320,
          height: 240
        },
        tip: {
          position: "absolute",
          left: 125,
          top: 360,
          width: 320,
          fontSize: 14,
          color: "#F5212D",
          textAlign: "center"
        },
        footer: {
          display: "flex",
          justifyContent: "space-between",
          width: 380,
          marginTop: 40
        },
        continueFooter: {
          justifyContent: "center"
        },
        dialogBtn: {
          width: 170,
          fontSize: 18
        },
        tripleBtn: {
          width: 110,
          fontSize: 18
        },
        secondBtn: {
          backgroundColor: "#fff",
          color: b.palette.primary.main,
          border: `1px solid ${b.palette.primary.main}`,
          "&:hover": {
            backgroundColor: "#fff"
          }
        },
        btnDisabled: {
          backgroundColor: "#F5F5F5",
          color: "#999",
          cursor: "none",
          pointerEvents: "none"
        },
        secondBtnDisabled: {
          backgroundColor: "#fff",
          borderColor: "#ccc",
          color: "#999",
          cursor: "none",
          pointerEvents: "none"
        },
        camPhoto: {
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 10
        },
        camCalibrate: {
          position: "absolute",
          width: 320,
          height: 240,
          left: "50%",
          transform: "translateX(-50%)",
          background: `url(${d}) no-repeat`,
          backgroundSize: "100% 100%",
          zIndex: 20
        },
        photo: {
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 30
        }
      });
    })(function (k) {
      var a = k.classes;
      var c = k.password;
      var n = k.setInvigilateVisible;
      var s = k.startExam;
      var l = (0, _.useState)(true);
      var m = (0, r.Z)(l, 2);
      var d = m[0];
      m[1];
      var o = (0, _.useState)(false);
      var p = (0, r.Z)(o, 2);
      var g = p[0];
      p[1];
      var u = (0, _.useState)(false);
      var w = (0, r.Z)(u, 2);
      var v = w[0];
      var x = w[1];
      var y = (0, _.useState)(true);
      var A = (0, r.Z)(y, 2);
      var B = A[0];
      var C = A[1];
      var D = (0, _.useState)(true);
      var E = (0, r.Z)(D, 2);
      var q = E[0];
      var L = E[1];
      var F = (0, _.useState)(false);
      var da = (0, r.Z)(F, 2);
      var M = da[0];
      var O = da[1];
      var P = (0, _.useState)(H.takePhoto);
      var z = (0, r.Z)(P, 2);
      var Q = z[0];
      var R = z[1];
      var G = (0, _.useState)(true);
      var S = (0, r.Z)(G, 2);
      var J = S[0];
      var T = S[1];
      (0, _.useEffect)(function () {
        setTimeout(la, 0);
        return function () {
          f.getContext("2d").clearRect(0, 0, 320, 240);
        };
      }, []);
      function la() {
        (f = document.createElement("canvas")).setAttribute("width", "320px");
        f.setAttribute("height", "240px");
        $(f).appendTo("#photo");
        var c = f.getContext("2d");
        var a = c.getImageData(0, 0, 320, 240);
        V(a, c);
      }
      function V(d, a) {
        $("#camPhoto").webcam({
          width: 320,
          height: 240,
          mode: "callback",
          swffile: "static/sdk/webcam/jscam_canvas_only.swf",
          onSave: function (b) {
            X(b, d, a);
          },
          onCapture: function () {
            webcam.save();
          },
          debug: function (c, a) {
            j(a);
          }
        });
      }
      function j(b) {
        if (b === "Camera started") {
          x(true);
          L(false);
          C(false);
        } else if (b === "Camera stopped") {
          e.g.$confirm({
            visible: true,
            onOk: function () {
              if ((0, U.w1)()) {
                window.location.reload();
              } else {
                W();
              }
            },
            content: (0, ca.vs)("examDetail_camera_invigilate")
          });
        } else if (b === "No camera was detected.") {
          n(false);
          e.g.$message((0, ca.vs)("examDetail_camera_unusual"));
        }
      }
      function W() {
        $("#photo").empty();
        T(false);
        setTimeout(function () {
          T(true);
          setTimeout(function () {
            la();
          }, 200);
        }, 200);
      }
      function X(h, b, c) {
        for (var d = h.split(";"), e = b, a = 0; a < 320; a++) {
          var j = parseInt(d[a], 10);
          e.data[i + 0] = j >> 16 & 255;
          e.data[i + 1] = j >> 8 & 255;
          e.data[i + 2] = j & 255;
          e.data[i + 3] = 255;
          i += 4;
        }
        if (i >= 307200) {
          c.putImageData(e, 0, 0);
          i = 0;
          Y();
        }
      }
      var Y = function () {
        var b = (0, N.Z)(t().mark(function b() {
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  R(H.uploadFaceImg);
                case 1:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      function Z() {
        n(false);
      }
      var ea = function () {
        var a = (0, N.Z)(t().mark(function d(b, a, c) {
          var h;
          return t().wrap(function (d) {
            for (;;) {
              switch (d.prev = d.next) {
                case 0:
                  d.next = 2;
                  return I.Oe.uploadFaceImg(a, c, b);
                case 2:
                  if (!(h = d.sent)._failure) {
                    d.next = 5;
                    break;
                  }
                  return d.abrupt("return");
                case 5:
                  if (h.data) {
                    R(H.identification);
                  } else {
                    n(false);
                    e.g.$message(h.message);
                  }
                case 6:
                case "end":
                  return d.stop();
              }
            }
          }, d);
        }));
        return function (c, b, d) {
          return a.apply(this, arguments);
        };
      }();
      var fa = aa().createElement("div", {
        className: a.footer
      }, aa().createElement(h.Z, {
        className: `${a.dialogBtn} ${a.secondBtn}`,
        onClick: Z
      }, (0, ca.vs)("cancel")), aa().createElement(ba.Z, {
        className: `${a.dialogBtn} ${B ? a.btnDisabled : ""}`,
        loading: g,
        onClick: function () {
          webcam.capture();
        }
      }, (0, ca.vs)("examDetail_photograph")));
      var ga = aa().createElement("div", {
        className: a.footer
      }, aa().createElement(h.Z, {
        className: `${a.tripleBtn} ${a.secondBtn}`,
        onClick: Z
      }, (0, ca.vs)("cancel")), aa().createElement(h.Z, {
        className: `${a.tripleBtn} ${a.secondBtn} ${M ? a.secondBtnDisabled : ""}`,
        onClick: function () {
          R(H.takePhoto);
        }
      }, (0, ca.vs)("examDetail_remake")), aa().createElement(ba.Z, {
        className: a.tripleBtn,
        loading: M,
        onClick: function () {
          var d = f.toDataURL("image/png").replace("data:image/png;base64,", "");
          var a = "";
          var e = "";
          if ((0, U.xG)().isSingleLogin === true) {
            a = "ITRAIN_PORTAL";
          } else {
            e = c || "";
          }
          O(true);
          ea(d, a, e);
        }
      }, Q === H.uploadFaceImg ? M ? (0, ca.vs)("examDetail_uploading") : (0, ca.vs)("examDetail_upload") : ""));
      var ha = aa().createElement("div", {
        className: `${a.footer} ${a.continueFooter}`
      }, aa().createElement(h.Z, {
        className: a.dialogBtn,
        onClick: s
      }, (0, ca.vs)("examDetail_exam_start")));
      var ia = aa().createElement(aa().Fragment, null, aa().createElement("div", {
        className: a.content
      }, J && aa().createElement("div", {
        id: "camPhoto",
        className: a.camPhoto
      }), v && aa().createElement("div", {
        className: a.camCalibrate
      }), aa().createElement("div", {
        id: "photo",
        className: a.photo,
        style: {
          display: Q === H.uploadFaceImg || Q === H.identification ? "block" : "none"
        }
      })), q && aa().createElement("div", {
        className: a.tip
      }, (0, ca.vs)("examDetail_allow_camera")));
      var ja = aa().createElement(aa().Fragment, null, Q === H.identification ? aa().createElement("div", {
        className: a.identification
      }, aa().createElement("div", {
        className: a.passTitle
      }, aa().createElement("img", {
        src: b,
        className: a.passIcon
      }), aa().createElement("div", {
        className: a.passText
      }, (0, ca.vs)("examDetail_certification_passed"))), aa().createElement("div", {
        className: a.recordSuccess
      }, (0, ca.vs)("examDetail_info_enter_success"))) : aa().createElement("div", {
        className: a.title
      }, Q === H.takePhoto ? (0, ca.vs)("examDetail_take_picture") : M ? (0, ca.vs)("examDetail_being_uploaded_review") : (0, ca.vs)("examDetail_imgUpload")));
      return aa().createElement(K.Z, {
        open: d,
        disableBackdropClick: true,
        classes: {
          paper: a.paper
        }
      }, ja, ia, Q === H.takePhoto ? fa : Q === H.uploadFaceImg ? ga : ha);
    });
    var w = (0, c.Z)(function (b) {
      return (0, g.Z)({
        inputWrapper: {
          width: "100%"
        },
        inputBox: {
          width: "100%",
          height: 32,
          padding: "6px 8px",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: 2,
          fontSize: 14,
          color: "#333333"
        },
        errorTip: {
          marginTop: 10,
          fontSize: 12,
          color: "#F5212D"
        }
      });
    })(function (b) {
      var c = b.classes;
      var e = b.startExam;
      var h = b.setInvigilateVisible;
      var j = (0, _.useState)(false);
      var a = (0, r.Z)(j, 2);
      var i = a[0];
      var l = a[1];
      var m = (0, _.useState)("");
      var d = (0, r.Z)(m, 2);
      var n = d[0];
      var o = d[1];
      var g = (0, _.useState)("");
      var f = (0, r.Z)(g, 2);
      var p = f[0];
      var s = f[1];
      var u = (0, _.useState)(false);
      var v = (0, r.Z)(u, 2);
      var k = v[0];
      var w = v[1];
      var x = (0, _.useState)(true);
      var y = (0, r.Z)(x, 2);
      var z = y[0];
      var A = y[1];
      var B = (0, _.useState)(false);
      var C = (0, r.Z)(B, 2);
      var D = C[0];
      var q = C[1];
      var E = aa().createElement("div", {
        className: c.inputWrapper
      }, aa().createElement("input", {
        type: "password",
        className: c.inputBox,
        placeholder: (0, ca.vs)("login_password"),
        value: n,
        onChange: function (b) {
          o(b.target.value);
          w(false);
        }
      }), k && aa().createElement("div", {
        className: c.errorTip
      }, p));
      var F = function () {
        var b = (0, N.Z)(t().mark(function b() {
          var d;
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  if (n.trim() !== "") {
                    b.next = 5;
                    break;
                  }
                  s((0, ca.vs)("enter_password"));
                  w(true);
                  return b.abrupt("return");
                case 5:
                  l(true);
                  b.next = 8;
                  return I.Oe.validatePassword((0, U.oB)(n));
                case 8:
                  d = b.sent;
                  l(false);
                  if (!d._failure) {
                    b.next = 12;
                    break;
                  }
                  return b.abrupt("return");
                case 12:
                  if (d.data) {
                    A(false);
                    q(true);
                  } else {
                    s((0, ca.vs)("enter_password_again"));
                    w(true);
                  }
                case 13:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      return aa().createElement(aa().Fragment, null, aa().createElement(V, {
        visible: z,
        title: (0, ca.vs)("enter_password_info"),
        okText: (0, ca.vs)("next_txt"),
        onOk: F,
        onCancel: function () {
          h(false);
        },
        loading: i
      }, E), D && aa().createElement(W, {
        password: (0, U.oB)(n.trim()),
        startExam: e,
        setInvigilateVisible: h
      }));
    });
    var S = (0, c.Z)(function (b) {
      return (0, g.Z)({
        validatePwd: {
          width: "100%",
          marginTop: 14
        },
        formControl: {
          height: 32,
          padding: "6px 8px",
          color: "#BFBFBF",
          borderRadius: 2
        },
        inputErrorTip: {
          marginTop: 10,
          fontSize: 12,
          color: "#F5212D"
        }
      });
    })(function (p) {
      p.classes;
      var b = p.setInvigilateVisible;
      var c = p.startExam;
      var e = (0, _.useState)(true);
      var h = (0, r.Z)(e, 2);
      var a = h[0];
      var i = h[1];
      var j = (0, _.useState)(false);
      var k = (0, r.Z)(j, 2);
      var l = k[0];
      var m = k[1];
      var d = (0, _.useState)(false);
      var n = (0, r.Z)(d, 2);
      var o = n[0];
      var g = n[1];
      return aa().createElement(aa().Fragment, null, aa().createElement(V, {
        visible: a,
        title: (0, ca.vs)("examDetail_face_recognition"),
        content: (0, ca.vs)("examDetail_face_recognition_tip"),
        onOk: function () {
          i(false);
          if ((0, U.xG)().isSingleLogin === true) {
            g(true);
          } else {
            m(true);
          }
        },
        onCancel: function () {
          b(false);
        }
      }), l && aa().createElement(w, {
        startExam: c,
        setInvigilateVisible: b
      }), o && aa().createElement(W, {
        setInvigilateVisible: b,
        startExam: c
      }));
    });
    var x = e(96486);
    var v = e.n(x);
    var A = e(37200);
    var B = e(22380);
    var C = e(64229);
    var q = (0, c.Z)(C.Z)(function (c) {
      var h = c.classes;
      var b = c.detail;
      var e = b.isPublishScore;
      var j = b.publishScoreTime;
      var a = b.isExamType;
      var i = b.markingStatus;
      var k = !j || new Date(j) < new Date();
      var l = e !== 0 && k;
      l = a ? i === 2 && l : l;
      function m(a, b) {
        var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
        return aa().createElement("div", {
          className: h.dataItem,
          key: b
        }, aa().createElement("div", {
          className: h.data
        }, aa().createElement("div", {
          className: h.dataNumber
        }, a), c !== "" && aa().createElement("div", {
          className: h.dataUnit
        }, c)), aa().createElement("div", {
          className: h.dataText
        }, b));
      }
      var n = b.myHighestScore ? b.myHighestScore : 0;
      var q = b.testType === A.kq.FORMAL && !v().isNull(b.myHighestScore) && b.attemptNum - b.remianingNum !== A.hn.NO;
      var d = b.testType === A.kq.MOCK && !v().isNull(b.myHighestScore);
      var p = b.testType === A.kq.MOCK && v().isNull(b.myHighestScore) && b.markingStatus === A.hn.YES || b.testType === A.kq.FORMAL && v().isNull(b.myHighestScore) && b.markingStatus === A.hn.YES && b.attemptNum - b.remianingNum !== A.hn.NO;
      var r = p ? (0, ca.vs)("examDetail_exam_marking") : (0, ca.vs)("examDetail_highestScore", {
        isPassed: `${b.isPassed ? (0, ca.vs)("examDetail_already") : (0, ca.vs)("examDetail_not_yet")}`,
        highestScore: n
      }) || d && (0, ca.vs)("examDetail_highestScore", {
        highestScore: n
      });
      var g = p ? `${h.testStatus} ${h.marking}` : d && `${h.testStatus} ${h.mock}` || (q && b.isPassed ? h.testStatus : `${h.testStatus} ${h.notPassed}`);
      return aa().createElement(aa().Fragment, null, aa().createElement("div", {
        className: h.topContent
      }, aa().createElement("div", {
        className: h.testName
      }, b.testName), r && l && aa().createElement("div", {
        className: g
      }, r)), aa().createElement("div", {
        className: h.testContent
      }, aa().createElement("div", {
        className: h.topData
      }, aa().createElement("div", {
        className: h.leftPart
      }), aa().createElement("div", {
        className: h.middlePart
      }, [m(b.testNum, (0, ca.vs)("examDetail_testNumTxt")), m(b.totalScoreStr, (0, ca.vs)("examDetail_total")), !!+b.minScoreStr && m(b.minScoreStr, (0, ca.vs)("examDetail_pass_score")), b.testType === A.kq.FORMAL ? m(b.testTime, (0, ca.vs)("examDetail_exam_duration"), (0, ca.vs)("examDetail_minute")) : m((0, ca.vs)("examDetail_unlimited"), (0, ca.vs)("examDetail_exam_duration"))]), aa().createElement("div", {
        className: h.rightPart
      })), aa().createElement("div", {
        className: h.testInfoWrapper
      }, aa().createElement("div", {
        className: b.isInvigilate === A.hn.YES ? h.invigilateTestInfo : h.testInfo
      }, aa().createElement("div", {
        className: h.infoItem
      }, aa().createElement("div", {
        className: h.infoLabel
      }, (0, ca.vs)("examDetail_open_time")), aa().createElement("div", {
        className: h.info
      }, b.testType === A.kq.FORMAL ? b.startTime !== null || b.endTime !== null ? `${J()(b.makeExamFlag ? b.makeExamStartTime : b.startTime).format("lll")}
              ——${J()(b.makeExamFlag ? b.makeExamEndTime : b.endTime).format("lll")}` : zn_t_intelligent_portal("94cc8417", "不限时间") : (0, ca.vs)("examDetail_no_limit_time"))), !!b.isAutoSubmit && aa().createElement("div", {
        className: h.infoItem
      }, aa().createElement("div", {
        className: h.autoLabel
      }, zn_t_intelligent_portal("215b4a21", "自动交卷时间：")), aa().createElement("div", {
        className: h.autoInfo
      }, aa().createElement("span", null, b.isAutoSubmit ? `${(0, B.k)(b)}` : (0, ca.vs)("examDetail_no_limit_time")), aa().createElement("span", {
        className: h.remainTimes
      }, zn_t_intelligent_portal("d11f1da5", "（时间到达后，将自动交卷）")))), aa().createElement("div", {
        className: h.infoItem
      }, aa().createElement("div", {
        className: h.infoLabel
      }, (0, ca.vs)("examDetail_exam_num")), aa().createElement("div", {
        className: `${h.info} ${h.remainTimesItem}`
      }, b.testType === A.kq.FORMAL ? aa().createElement(aa().Fragment, null, (0, ca.vs)("examDetail_remainTimes", {
        remianingNum: aa().createElement("span", {
          className: h.remainTimes
        }, b.remianingNum)
      })) : (0, ca.vs)("examDetail_no_limit_num"))), aa().createElement("div", {
        className: h.infoItem
      }, aa().createElement("div", {
        className: h.infoLabel
      }, (0, ca.vs)("examDetail_exam_careful")), aa().createElement("div", {
        className: `${h.info} ${h.attentionItem}`
      }, (0, ca.vs)("after_start_exam", {
        text: aa().createElement("span", {
          style: {
            color: "red"
          }
        }, (0, ca.vs)("not_close_brower"))
      }, 1))), b.isInvigilate === A.hn.YES && aa().createElement("div", {
        className: h.infoItem
      }, aa().createElement("div", {
        className: h.infoLabel
      }, (0, ca.vs)("examDetail_invigilation_mode")), aa().createElement("div", {
        className: `${h.info} ${h.invigilateItem}`
      }, (0, ca.vs)("examDetail_invigilateItem")))))));
    });
    var E = e(57972);
    var D = e(95850);
    var F = e(20992);
    var L = e(9549);
    var M = (0, c.Z)(C.Z)(function (b) {
      var s = b.classes;
      var c = b.detail;
      var e = b.setExamStage;
      var j = b.setIsFromResult;
      var a = b.currentTime;
      var i = b.examId;
      var l = (0, _.useState)(false);
      var m = (0, r.Z)(l, 2);
      var d = m[0];
      var n = m[1];
      var o = c.isPublishScore;
      var g = c.publishScoreTime;
      var f = c.isExamType;
      var h = c.markingStatus;
      var p = !g || new Date(g) < new Date();
      var q = o !== 0 && p;
      q = f ? h === 2 && q : q;
      function w(a, b, c) {
        return aa().createElement("div", {
          className: s.checkItem,
          onClick: c
        }, aa().createElement("img", {
          className: s.checkIcon,
          src: a
        }), aa().createElement("div", {
          className: s.checkText
        }, b));
      }
      var v = function () {
        var b = (0, N.Z)(t().mark(function b() {
          var d;
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  b.next = 2;
                  return I.Oe.isHasAttempt({
                    examId: i
                  });
                case 2:
                  if (+(d = b.sent).code === 0) {
                    b.next = 5;
                    break;
                  }
                  return b.abrupt("return");
                case 5:
                  n((d === null || d === undefined ? undefined : d.body) || false);
                case 6:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      var x = +a > c.endTime;
      var k = c.ishidenerrquestion === "N" && (c.testType !== "F" || c.showErrorType === 1 || c.showErrorType === 2 && x);
      var z = c.testType === A.kq.MOCK && c.hasHistoryScore === A.hn.YES;
      (0, _.useEffect)(function () {
        v();
      }, []);
      return aa().createElement("div", {
        className: s.checkArea
      }, k && q && w(D, (0, ca.vs)("examDetail_check_wrong"), function () {
        j(false);
        e(A.Bc.errorQuestions);
      }), z && w(F, (0, ca.vs)("examDetail_history_results"), function () {
        e(A.Bc.historyScore);
      }), c.certificateId !== "" && c.isPassed === A.hn.YES && q && w(E, (0, ca.vs)("examDetail_check_certificate"), function () {
        e(A.Bc.checkCertificate);
      }), d && q && w(L, zn_t_intelligent_portal("8f0cdc6d", "查看成绩排行榜"), function () {
        window.location.href = `#/home/examScoreRank/${i}`;
      }));
    });
    var R = e(66045);
    var Q = 1;
    var O = (0, c.Z)(C.Z)(function (b) {
      var s = b.classes;
      var h = b.examId;
      var l = b.detail;
      var a = b.onStartInvigilate;
      var c = b.onStartExam;
      b.getExamBreakInfo;
      var i = b.currentTime;
      var m = b.cutScreenInfo;
      var n = (0, _.useState)((0, ca.vs)("examDetail_exam_start"));
      var d = (0, r.Z)(n, 2);
      var o = d[0];
      var g = d[1];
      var f = (0, _.useState)(true);
      var p = (0, r.Z)(f, 2);
      var H = p[0];
      var u = p[1];
      var v = (0, _.useState)(false);
      var k = (0, r.Z)(v, 2);
      var w = k[0];
      var x = k[1];
      var y = (0, _.useState)("");
      var K = (0, r.Z)(y, 2);
      var C = K[0];
      var B = K[1];
      var E = (0, _.useState)(false);
      var D = (0, r.Z)(E, 2);
      var q = D[0];
      var P = D[1];
      var F = (0, _.useState)(false);
      var L = (0, r.Z)(F, 2);
      var M = L[0];
      var Z = L[1];
      var O = (0, _.useState)(false);
      var z = (0, r.Z)(O, 2);
      var G = z[0];
      var da = z[1];
      var J = l.isPc;
      var S = J === undefined ? 1 : J;
      (0, _.useEffect)(function () {
        if (l.testType === A.kq.FORMAL && i) {
          T();
        }
      }, [l, i]);
      function T() {
        var a = +i;
        if (l.makeExamFlag) {
          if (l.makeExamStartTime > a || l.makeExamEndTime < a) {
            u(false);
            g(l.makeExamStartTime > a ? zn_t_intelligent_portal("ddda1b57", "补考未开始") : zn_t_intelligent_portal("f939a5cd", "补考已逾期"));
            return;
          } else if (l.remianingNum === 0) {
            u(false);
            g(zn_t_intelligent_portal("2c8c1f53", "当前已没有补考机会"));
            return;
          } else {
            ea();
            return;
          }
        } else if (l.startTime !== null && l.endTime !== null) {
          if (l.startTime > a || l.endTime < a) {
            u(false);
            g(l.startTime > a ? (0, ca.vs)("examDetail_exam_no_start") : (0, ca.vs)("examDetail_exam_end"));
            return;
          } else if (l.remianingNum === 0) {
            u(false);
            g((0, ca.vs)("examDetail_exam_complete"));
            return;
          } else {
            ea();
            return;
          }
        } else {
          g(zn_t_intelligent_portal("1b04d1ff", "开始考试"));
          return;
        }
      }
      function ea() {
        var a = "";
        if (l.isNeedEnroll === A.hn.YES) {
          if (l.enrollStatus === A.h2.NO_ENROLL) {
            a = (0, ca.vs)("examDetail_exam_registration");
          } else if (l.enrollStatus === A.h2.CHECKIING_PASSED) {
            a = l.attemptNum - l.remianingNum > 0 ? (0, ca.vs)("examDetail_exam_again") : l.makeExamFlag ? zn_t_intelligent_portal("f7dbd0f5", "开始补考") : (0, ca.vs)("examDetail_exam_start");
          } else {
            a = (0, ca.vs)("examDetail_under_review");
            u(false);
          }
        } else {
          a = l.makeExamFlag ? zn_t_intelligent_portal("f7dbd0f5", "开始补考") : l.attemptNum - l.remianingNum > 0 ? (0, ca.vs)("examDetail_test_again") : (0, ca.vs)("examDetail_exam_start");
        }
        g(a);
      }
      var j = function () {
        var b = (0, N.Z)(t().mark(function b() {
          var d;
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  b.next = 2;
                  return I.Oe.submitExamEnroll(h);
                case 2:
                  if (!b.sent._failure) {
                    b.next = 5;
                    break;
                  }
                  return b.abrupt("return");
                case 5:
                  g((0, ca.vs)("examDetail_under_review"));
                  u(false);
                  d = aa().createElement("div", {
                    className: s.ManipulateDialogContent
                  }, (0, ca.vs)("examDetail_info_submited"));
                  B(d);
                  x(true);
                case 10:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      var V = function () {
        var a = (0, N.Z)(t().mark(function a() {
          var b;
          var d;
          var f;
          var n;
          var o;
          var u;
          var v;
          return t().wrap(function (a) {
            for (;;) {
              switch (a.prev = a.next) {
                case 0:
                  b = window.outerWidth + 10 >= screen.availWidth && window.outerHeight + 10 >= screen.availHeight;
                  if (S) {
                    a.next = 6;
                    break;
                  }
                  d = aa().createElement("div", {
                    className: s.ManipulateDialogContent
                  }, zn_t_intelligent_portal("2cf400b0", "本考试已被管理员设置为仅支持APP参与考试，请通过APP进行考试"));
                  B(d);
                  x(true);
                  return a.abrupt("return");
                case 6:
                  if (!m || m.remainderTimes !== 0) {
                    a.next = 9;
                    break;
                  }
                  da(true);
                  return a.abrupt("return");
                case 9:
                  f = window.navigator.userAgent.toLocaleLowerCase();
                  n = f.indexOf("wxwork") > -1;
                  o = Number(f.split("chrome/")[1].split(".")[0]);
                  if (f.includes("mac") && f.includes("chrome") && o > 110) {
                    b = true;
                  }
                  if (n) {
                    b = true;
                  }
                  if (b || l.isFlipScreen !== A.iK.Open) {
                    a.next = 17;
                    break;
                  }
                  Z(true);
                  return a.abrupt("return");
                case 17:
                  if (l.testType !== A.kq.QUIZ) {
                    a.next = 20;
                    break;
                  }
                  e.g.$message((0, ca.vs)("examDetail_go_from_app"));
                  return a.abrupt("return");
                case 20:
                  if (l.testType !== A.kq.FORMAL || l.isOpenScreenShot !== A.hn.YES) {
                    a.next = 31;
                    break;
                  }
                  P(true);
                  a.next = 24;
                  return I.Oe.getScreenShotInfo({
                    resourceId: h,
                    businessType: 2
                  });
                case 24:
                  u = a.sent;
                  P(false);
                  if (!u.body || u.body.status !== Q) {
                    a.next = 31;
                    break;
                  }
                  v = aa().createElement("div", {
                    className: s.ManipulateDialogContent
                  }, (0, ca.vs)("examDetail_forbidden_enter"));
                  B(v);
                  x(true);
                  return a.abrupt("return");
                case 31:
                  if (l.isNeedEnroll === A.hn.YES) {
                    if (l.enrollStatus === A.h2.NO_ENROLL) {
                      j();
                    } else if (l.enrollStatus === A.h2.CHECKIING_PASSED) {
                      W();
                    }
                  } else if (l.isInvigilate === A.hn.YES) {
                    X();
                  } else {
                    W();
                  }
                case 32:
                case "end":
                  return a.stop();
              }
            }
          }, a);
        }));
        return function () {
          return a.apply(this, arguments);
        };
      }();
      var W = function () {
        var b = (0, N.Z)(t().mark(function b() {
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  P(true);
                  b.next = 3;
                  return c();
                case 3:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      var X = function () {
        var b = (0, N.Z)(t().mark(function b() {
          var e;
          var f;
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  P(true);
                  e = (0, U.xG)();
                  b.next = 4;
                  return I.Oe.personDetail(e.sessionInfo.userId);
                case 4:
                  f = b.sent;
                  P(false);
                  if (!f._failure) {
                    b.next = 8;
                    break;
                  }
                  return b.abrupt("return");
                case 8:
                  if (f.body.faceImgUploaded) {
                    W();
                  } else {
                    a();
                  }
                case 9:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      return aa().createElement(aa().Fragment, null, aa().createElement(ba.Z, {
        loading: q,
        className: `${s.manipulateBtn} ${H ? "" : s.btnDisabled}`,
        onClick: V
      }, o), aa().createElement(R.Z, {
        visible: w,
        content: C,
        okText: (0, ca.vs)("i_got_it"),
        onOk: function () {
          x(false);
        }
      }), aa().createElement(R.Z, {
        visible: M,
        onOk: function () {
          return Z(false);
        },
        okText: (0, ca.vs)("i_got_it")
      }, aa().createElement("div", {
        className: s.warningText
      }, (0, ca.vs)("warning")), aa().createElement("div", null, (0, ca.vs)("keep_screen_max"))), aa().createElement(R.Z, {
        visible: G,
        onOk: function () {
          return da(false);
        },
        okText: (0, ca.vs)("i_got_it")
      }, aa().createElement("div", null, (0, ca.vs)("administrator_to_unblock"))));
    });
    var z = e(9828);
    var G = (0, c.Z)(C.Z)(function (b) {
      var c = b.classes;
      var e = b.examId;
      var f = b.detail;
      var g = b.setExamStage;
      var a = b.startExam;
      var h = b.getExamBreakInfo;
      var i = b.setIsFromResult;
      var d = b.cutScreenInfo;
      var j = (0, _.useState)(false);
      var n = (0, r.Z)(j, 2);
      var s = n[0];
      var u = n[1];
      var v = (0, _.useState)("");
      var w = (0, r.Z)(v, 2);
      var k = w[0];
      var x = w[1];
      var y = z.Z.IntlCommon.browserLanguage;
      var A = y === "en" ? o : l;
      var B = y === "en" ? p : m;
      var C = f.testType === "F" ? A : B;
      var E = f.isAgainTest === 0 && f.isPassed === 1;
      var D = function () {
        var b = (0, N.Z)(t().mark(function b() {
          var d;
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  b.next = 2;
                  return I.Gn.getTimestamp();
                case 2:
                  if (!(d = b.sent)._failure) {
                    b.next = 5;
                    break;
                  }
                  return b.abrupt("return");
                case 5:
                  x(d.body.timestamp);
                case 6:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      (0, _.useEffect)(function () {
        D();
        (function () {
          var d = localStorage.getItem("empId") || "";
          if (d) {
            var a = document.getElementById("examDetailWatermark");
            var b = `${d}    ${J()().format("YYYY.MM.DD")}`;
            (0, U.W$)(b, a, "examDetailDom");
          }
        })();
      }, []);
      return aa().createElement(aa().Fragment, null, aa().createElement("img", {
        className: c.testCategory,
        src: C
      }), aa().createElement("div", {
        className: c.contentWrapper,
        id: "examDetailWatermark"
      }, aa().createElement("div", {
        className: c.content
      }, aa().createElement(q, {
        detail: f
      }), !E && aa().createElement(O, {
        examId: e,
        detail: f,
        onStartInvigilate: function () {
          u(true);
        },
        onStartExam: a,
        getExamBreakInfo: h,
        currentTime: k,
        cutScreenInfo: d
      }), aa().createElement(M, {
        detail: f,
        setExamStage: g,
        setIsFromResult: i,
        currentTime: k,
        examId: e
      }))), s && aa().createElement(S, {
        startExam: a,
        setInvigilateVisible: u
      }));
    });
  },
  9057: function (a, b, e) {
    "use strict";

    e.d(b, {
      Z: function () {
        return w;
      }
    });
    var f;
    var j = e(20042);
    var n = e(67294);
    var i = e.n(n);
    var g = e(52543);
    var r = e(50124);
    var h = e(87623);
    var c = e(91155);
    var l = e(20849);
    var q = e(37200);
    var m = e(69134);
    var o = 0;
    var d = 0;
    var v = "";
    var w = (0, g.Z)(function (b) {
      return (0, h.Z)({
        invigilate: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: 640,
          paddingTop: 129,
          backgroundColor: "#fff",
          boxSizing: "border-box"
        },
        examInvigilate: {
          position: "absolute",
          height: 0,
          paddingTop: 0,
          right: 0,
          bottom: 0
        },
        title: {
          fontSize: 22,
          fontWeight: "bold",
          color: "#333"
        },
        camPhoto: {
          width: 220,
          height: 166,
          marginTop: 30
        },
        examCam: {
          position: "fixed",
          right: 70,
          bottom: 10
        },
        invigilating: {
          borderRadius: 15,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "fixed",
          bottom: 15,
          right: 75,
          height: 30,
          lineHeight: 30,
          width: 82,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& .dot": {
            width: 8,
            height: 8,
            backgroundColor: "#00D3AB",
            color: "#00D3AB",
            display: "inline-block",
            borderRadius: "50%",
            marginRight: 3
          },
          "& .word": {
            color: "#fff",
            fontSize: 14,
            display: "inline-block"
          }
        },
        cancel: {
          width: 170,
          height: 48,
          marginTop: 50,
          fontSize: 18,
          backgroundColor: "#fff",
          color: b.palette.primary.main,
          border: `1px solid ${b.palette.primary.main}`,
          "&:hover": {
            backgroundColor: "#fff"
          }
        },
        hide: {
          display: "none"
        },
        camera: {
          "&:lang(en)": {
            width: "280px"
          }
        }
      });
    })(function (k) {
      var a = k.classes;
      var p = k.camOpening;
      var s = k.attemptId;
      var u = k.examId;
      var g = k.openCamDone;
      var h = k.setExamStage;
      var z = (0, n.useState)(false);
      var t = (0, j.Z)(z, 2);
      var P = t[0];
      var w = t[1];
      var x = (0, n.useState)(null);
      var b = (0, j.Z)(x, 2);
      var A = b[0];
      var E = b[1];
      var C = (0, n.useState)(null);
      var y = (0, j.Z)(C, 2);
      var G = y[0];
      var H = y[1];
      (0, n.useEffect)(function () {
        d = 0;
        setTimeout(I, 500);
      }, []);
      (0, n.useEffect)(function () {
        return function () {
          J();
          f.getContext("2d").clearRect(0, 0, 320, 240);
        };
      }, [G]);
      (0, n.useEffect)(function () {
        v = s;
      }, [s]);
      function I() {
        (f = document.createElement("canvas")).setAttribute("width", "320px");
        f.setAttribute("height", "240px");
        $(f).appendTo("#examPhoto");
        var g = navigator.userAgent.match(/Chrome\/(([0-9]|\.)+)/);
        var a = g && g[1];
        var b = f.getContext("2d");
        var c = b.getImageData(0, 0, 320, 240);
        if (a && +a.split(".")[0] >= 66) {
          var d = document.createElement("video");
          E(d);
          $(d).appendTo("#examCamPhoto");
          webcam.save = function () {
            M();
          };
          webcam.capture = function () {
            webcam.save();
          };
          w(true);
        } else {
          L(c, b);
        }
      }
      function B() {
        e.g.$confirm({
          visible: true,
          content: (0, m.vs)("examDetail_camera_unusual")
        });
      }
      function J() {
        if (G) {
          G.getTracks()[0].stop();
        }
      }
      function D() {
        var d;
        var e;
        var g = f.getContext("2d");
        d = A;
        e = g;
        window.setInterval(function () {
          e.drawImage(d, 0, 0, 320, 240);
        }, 60);
      }
      function K(b) {
        A.srcObject = b;
        H(b);
        A.play();
        D();
        g();
      }
      function L(d, a) {
        $("#examCamPhoto").webcam({
          width: 220,
          height: 166,
          mode: "callback",
          swffile: "static/sdk/webcam/jscam_canvas_only.swf",
          onSave: function (b) {
            Q(b, d, a);
          },
          onCapture: function () {
            webcam.save();
          },
          debug: function (c, a) {
            N(a);
          }
        });
      }
      function N(b) {
        if (b === "Camera started") {
          g();
        } else if (b === "Camera stopped") {
          e.g.$confirm({
            visible: true,
            onOk: function () {
              if ((0, c.w1)()) {
                window.location.reload();
              } else {
                F();
              }
            },
            content: (0, m.vs)("examDetail_camera_invigilate")
          });
        } else if (b === "No camera was detected.") {
          e.g.$confirm({
            visible: true,
            content: (0, m.vs)("examDetail_camera_unusual")
          });
        }
      }
      function F() {
        $("#examCamPhoto").empty();
        setTimeout(function () {
          I();
        }, 200);
      }
      function Q(h, b, c) {
        for (var d = h.split(";"), e = b, a = 0; a < 320; a++) {
          var i = parseInt(d[a], 10);
          e.data[o + 0] = i >> 16 & 255;
          e.data[o + 1] = i >> 8 & 255;
          e.data[o + 2] = i & 255;
          e.data[o + 3] = 255;
          o += 4;
        }
        if (o >= 307200) {
          c.putImageData(e, 0, 0);
          o = 0;
          M();
        }
      }
      function M() {
        var c = f.toDataURL("image/png").replace("data:image/png;base64,", "");
        if (d === 0 || d === 1) {
          var a = d + 1;
          l.Oe.faceCollectBackUp(v, u, c, a);
        }
        if (d !== 0) {
          l.Oe.faceRecognition(v, u, c);
        }
        d++;
      }
      return i().createElement("div", {
        className: `${a.invigilate} ${p ? "" : a.examInvigilate}`
      }, p && i().createElement("div", {
        className: a.title
      }, (0, m.vs)("examDetail_allow_camera")), i().createElement("div", {
        id: "examCamPhoto",
        className: `${a.camPhoto} ${p ? "" : a.examCam}`
      }), i().createElement("div", {
        className: `${p ? a.hide : a.invigilating}`
      }, i().createElement("span", {
        className: "dot"
      }, "."), i().createElement("span", {
        className: "word"
      }, (0, m.vs)("examDetail_invigilating"))), i().createElement("div", {
        id: "examPhoto",
        style: {
          display: "none"
        }
      }), P && i().createElement(r.Z, {
        onClick: function () {
          if (navigator.getUserMedia) {
            navigator.getUserMedia({
              video: {
                width: 320,
                height: 240
              },
              audio: false
            }, K, B);
          } else {
            e.g.$confirm({
              visible: true,
              content: (0, m.vs)("examDetail_camera_unusual")
            });
          }
        },
        style: {
          top: -65
        },
        className: a.camera
      }, (0, m.vs)("allow_camera")), p && i().createElement(r.Z, {
        className: a.cancel,
        onClick: function () {
          h(q.Bc.info);
        }
      }, (0, m.vs)("cancel")));
    });
  },
  33774: function (a, j, Q) {
    "use strict";

    Q.d(j, {
      Z: function () {
        return Ya;
      }
    });
    var e;
    var X = Q(79043);
    var q = Q(89472);
    var aa = Q(18489);
    var ba = Q(67294);
    var ca = Q.n(ba);
    var da = Q(52543);
    var c = Q(87623);
    var i = Q(36926);
    var l = Q(55132);
    var m = Q(78271);
    var d = Q(30162);
    var o = Q(66888);
    var p = Q(53315);
    var g = Q(35755);
    var f = "#F5212D";
    var h = "#52C41A";
    var r = "#1890FF";
    function s(b) {
      return (0, c.Z)({
        tip: {
          fontFamily: "PingFangSC-Regular",
          fontSize: "14px",
          color: "#999999",
          marginTop: 10
        },
        subject: {
          width: 1000,
          margin: "0 auto",
          minHeight: 338
        },
        subjectType: {
          padding: "0px 5px",
          display: "inline-block",
          lineHeight: "22px",
          height: 22,
          marginRight: 5,
          borderRadius: 2,
          backgroundColor: "#1890FF",
          color: "#fff",
          fontSize: 14,
          minWidth: 42
        },
        flexBlock: {
          display: "flex"
        },
        questionTitle: {
          fontSize: 18,
          lineHeight: "28px",
          display: "flex",
          alignItems: "baseline"
        },
        caseSubject: {
          width: 820,
          margin: "0 auto"
        },
        question: {
          fontSize: 18,
          color: "#333",
          lineHeight: "28px",
          fontWeight: "bold"
        },
        questionText: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 30
        },
        videoWrap: {
          position: "relative"
        },
        image: {
          width: 270,
          height: 162,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundColor: "#EDEFF5"
        },
        playIcon: {
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        },
        play: {
          width: 42,
          height: 42,
          background: `url(${g}) no-repeat`,
          backgroundSize: "42px 42px"
        },
        video: {
          width: "100%",
          height: "100%"
        },
        hasResource: {
          marginRight: 50
        },
        hasIEResource: {
          marginRight: 50
        },
        options: {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          margin: "10px 0px 0"
        },
        option: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: 450,
          marginBottom: 20,
          padding: "14px 20px",
          boxSizing: "border-box",
          border: "1px solid #E5E5E5",
          color: "#333",
          fontSize: 14,
          lineHeight: "20px",
          cursor: "pointer",
          "& img": {
            width: "100%"
          }
        },
        selectedOption: {
          borderColor: r,
          color: r
        },
        successIcon: {
          width: 22,
          height: 22,
          background: `url(${p}) no-repeat`,
          backgroundSize: "22px 22px",
          display: "inline-block"
        },
        checkBoxWrap: {
          display: "flex",
          alignItems: "center",
          flex: 1
        },
        checkBox: {
          width: 18,
          height: 18,
          marginRight: 7,
          border: "1px solid #E5E5E5"
        },
        checkedBox: {
          width: 20,
          height: 20,
          marginRight: 7,
          background: `url(${i}) no-repeat`,
          display: "inline-block",
          backgroundSize: "20px 20px"
        },
        questionAndAnswer: {
          fontSize: 16,
          color: "#333"
        },
        textareaWrap: {
          border: "1px solid #E5E5E5",
          borderRadius: 2,
          background: "#F5F5F5"
        },
        questionInput: {
          width: "100%",
          height: 150,
          resize: "none",
          textIndent: 10,
          padding: 10,
          boxSizing: "border-box",
          color: "#333333",
          background: "transparent",
          border: "none",
          "&::placeholder": {
            paddingTop: 1
          }
        },
        answerLength: {
          width: "100%",
          textAlign: "right",
          fontSize: 16,
          color: "#B2B2B2",
          marginTop: 10
        },
        myAnswerTitle: {
          margin: "10px 0"
        },
        myAnswerBox: {
          width: "100%",
          minHeight: 40,
          borderBottom: "1px solid #E5E5E5",
          lineHeight: "30px"
        },
        referAnswerTitle: {
          color: "#666",
          margin: "13px 0 10px"
        },
        referAnswer: {
          color: "#666",
          lineHeight: "30px"
        },
        imageOptions: {
          justifyContent: "space-between"
        },
        imgQuestionWrap: {
          width: 140,
          textAlign: "center",
          fontSize: 20,
          color: "#333333"
        },
        imgWrap: {
          position: "relative",
          width: 140,
          height: 100,
          border: "6px solid #FFF"
        },
        imgNum: {
          marginTop: 18,
          marginBottom: 20
        },
        imgAnswer: {
          width: "100%",
          height: "100%"
        },
        previewIcon: {
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 24,
          height: 24,
          background: `url(${o}) no-repeat`,
          backgroundSize: "24px 24px"
        },
        selectedImage: {
          border: `6px solid ${r}`
        },
        myAnswerWrap: {
          fontSize: 14,
          margin: "10px 0 30px"
        },
        myAnswerText: {
          color: f,
          marginRight: 20
        },
        correctAnswerText: {
          color: h
        },
        errorBorderColor: {
          borderColor: f,
          color: f
        },
        correctBorderColor: {
          borderColor: h
        },
        correctOptions: {
          border: "none",
          background: h,
          color: "#FFF"
        },
        promptWrap: {
          display: "flex",
          position: "relative",
          fontSize: 14,
          color: "#D59139",
          marginTop: 10
        },
        prompt: {
          cursor: "pointer",
          width: 105,
          height: 30,
          marginRight: 10,
          background: "#FFFCF7",
          border: "1px solid #FFE7C8",
          borderRadius: 2,
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          fontWeight: "normal",
          "&:hover": {
            background: "#FFF2E0"
          }
        },
        downloadBtn: {
          width: "auto",
          padding: "0 10px",
          background: "#fff",
          border: "1px solid #999",
          color: "#666",
          "&:hover": {
            background: "#FFF"
          }
        },
        promptIcon: {
          display: "inline-block",
          width: 18,
          height: 18,
          background: `url(${l}) no-repeat`,
          backgroundSize: "18px 18px",
          margin: "0 3px 0 13px",
          borderRadius: "2px"
        },
        downloadIcon: {
          background: `url(${m}) no-repeat`,
          margin: "0 0 0 0",
          backgroundSize: "contain"
        },
        promptModal: {
          position: "absolute",
          top: -2,
          width: 400,
          maxHeight: 200,
          background: "#FFFCF7",
          border: "1px solid #FFE7C8",
          borderRadius: 2,
          zIndex: 999,
          overflow: "hidden",
          boxShadow: "0 0 30px #e5e5e5",
          paddingBottom: 15
        },
        promptTitle: {
          height: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          zIndex: 1,
          padding: "15px 15px 0",
          background: "#FFFCF7",
          fontWeight: "normal"
        },
        close: {
          width: 16,
          height: 16,
          background: `url(${d}) no-repeat`,
          backgroundSize: "16px 16px",
          cursor: "pointer"
        },
        mes: {
          padding: "35px 15px 0",
          lineHeight: "24px",
          background: "#FFFCF7",
          width: 380,
          maxHeight: 147,
          overflow: "auto",
          fontWeight: "normal",
          wordBreak: "break-word"
        },
        flexContainer: {
          flex: 1
        },
        videoPlayer: {
          width: "270px!important",
          height: "152px!important",
          background: "#333"
        },
        attachmentWrap: {
          marginBottom: 70
        },
        attachmentTitle: {
          color: "#333",
          fontSize: 16
        },
        attachmentTipText: {
          color: "#999",
          fontSize: 14
        }
      });
    }
    var ea = Q(37200);
    var fa = Q(36222);
    var I = Q(17186);
    var ga = Q(20042);
    var b = Q(94184);
    var ha = Q.n(b);
    var k = Q(91155);
    var t = Q(80117);
    var u = Q(45759);
    var w = (0, da.Z)(function (b) {
      return (0, c.Z)({
        modalWrap: {
          width: "100vw",
          height: "100vh",
          minHeight: 700,
          backgroundColor: "rgba(0,0,0,0.6)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        },
        resourceWrap: {
          position: "relative"
        },
        close: {
          position: "absolute",
          right: 0,
          top: 0,
          width: 40,
          height: 40,
          background: `url(${t}) no-repeat`,
          backgroundSize: "40px 40px"
        },
        image: {
          width: 700,
          height: 700,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain"
        },
        video: {
          width: "870px!important",
          height: "490px!important",
          marginTop: 60,
          marginBottom: 60,
          background: "#333"
        }
      });
    })(function (g) {
      var b = g.classes;
      var c = g.visible;
      var d = g.resourceUrl;
      var e = g.closeModal;
      var a = g.type;
      return ca().createElement(ca().Fragment, null, c && ca().createElement("div", {
        className: b.modalWrap
      }, ca().createElement("div", {
        className: b.resourceWrap
      }, ca().createElement("div", {
        className: b.close,
        onClick: e
      }), a === "img" ? ca().createElement("div", {
        className: b.image,
        style: {
          backgroundImage: `url(${d}) `
        }
      }) : ca().createElement(u.Z, {
        className: b.video,
        playUrl: d,
        controls: true,
        controlsList: "nodownload"
      }))));
    });
    var v = Q(96486);
    var x = Q.n(v);
    var y = Q(81410);
    var B;
    var A;
    var S = (0, da.Z)(function (b) {
      return (0, c.Z)({
        blankInput: {
          opacity: 0,
          position: "absolute",
          top: -1000,
          left: -1000,
          width: 300,
          height: 32,
          padding: "6px 8px",
          boxSizing: "border-box",
          border: "1px solid #ccc",
          borderRadius: 2,
          fontSize: 14,
          color: "#333333",
          pointerEvents: "none"
        },
        showInput: {
          opacity: 1
        },
        blankTextBox: {
          marginBottom: 10,
          lineHeight: "34px",
          "& .titleGapWrap": {
            display: "inline",
            margin: "0 4px 0px 12px"
          },
          "& .flexBlock": {
            display: "flex"
          },
          "& .titleGap": {
            display: "inline",
            whiteSpace: "normal",
            border: "1px solid #B2B2B2",
            borderRadius: 4,
            marginRight: 8,
            marginLeft: 8,
            lineHeight: "28px",
            padding: "5px 6px"
          },
          "& .blanksDetail": {
            display: "inline-block",
            background: "#FFFFFF",
            borderRadius: 4,
            width: 24,
            height: 28,
            fontSize: 18,
            textAlign: "center",
            lineHeight: "28px",
            fontWeight: "normal",
            verticalAlign: "middle"
          },
          "& .answerBlanksDetail": {
            width: "auto"
          },
          "& .hasContent": {
            borderColor: "#1890FF",
            color: "#1890FF"
          },
          "& .wrongBlank": {
            borderColor: "#F5212D",
            color: "#F5212D"
          },
          "& .rightBlank": {
            borderColor: "#52C41A",
            color: "#52C41A"
          }
        },
        flexBox: {
          display: "flex"
        }
      });
    })(function (b) {
      var a = b.classes;
      var c = b.currentSubject;
      var j = b.onSelectOption;
      var k = b.isViewErrorQuestions;
      var n = b.answerList;
      var i = b.isFromResult;
      var o = b.disabled;
      var l = b.showAnswerStatus;
      var r = c.myAnswer;
      var m = c.questionText;
      var d = c.sectionRespList;
      var p = d === undefined ? [] : d;
      var s = c.questionId;
      var g = c.isAnswerOrder;
      var f = p.map(function () {
        return "";
      });
      var h = p.map(function (b) {
        return b.sectionText;
      });
      var t = (0, ba.useRef)(null);
      var u = (0, ba.useRef)(k ? i && r && r.length > 0 && l ? r : f : n && n.length > 0 ? n : f);
      var x = (0, ba.useRef)(null);
      var w = (0, ba.useState)({
        inputIndex: -1,
        stringIndex: -1
      });
      var A = (0, ga.Z)(w, 2);
      var B = A[0];
      var C = A[1];
      var E = (0, ba.useState)(false);
      var L = (0, ga.Z)(E, 2);
      var N = L[0];
      var R = L[1];
      var S = (0, ba.useState)(false);
      var D = (0, ga.Z)(S, 2);
      var q = D[0];
      var Q = D[1];
      var F = (0, ba.useState)("");
      var T = (0, ga.Z)(F, 2);
      var M = T[0];
      var O = T[1];
      function P(a) {
        var b = a.target;
        if (b) {
          var c = b;
          if (c.getAttribute("data-type") === "space-box") {
            var d = c.getAttribute("data-index");
            if (d !== null) {
              U(a, +d);
            }
          }
        }
      }
      (0, ba.useEffect)(function () {
        var c;
        var d;
        if (o) {
          if (!((c = t.current) === null || c === undefined)) {
            c.removeEventListener("click", P);
          }
        } else if (!((d = t.current) === null || d === undefined)) {
          d.addEventListener("click", P);
        }
      }, [m, o]);
      (0, ba.useEffect)(function () {
        document.oncontextmenu = function (b) {
          b.preventDefault();
        };
        document.onselectstart = function (b) {
          b.preventDefault();
        };
        document.onpaste = function () {
          return false;
        };
        document.oncopy = function () {
          return false;
        };
        document.oncut = function () {
          return false;
        };
        document.onclick = W;
      }, []);
      (0, ba.useEffect)(function () {
        if (N) {
          var b = V(B.inputIndex);
          z(B.inputIndex, b);
        }
      }, [u.current]);
      function z(c, a) {
        C({
          inputIndex: c,
          stringIndex: a
        });
      }
      function U(d, a) {
        d.stopImmediatePropagation();
        if (!k && !o && x.current !== null) {
          x.current.focus();
          var b = V(a);
          z(a, b);
          O(u.current[a]);
          R(true);
        }
      }
      function W() {
        R(false);
        z(-1, -1);
      }
      function G(d, a) {
        if (!k) {
          var b = u.current.map(function (b, c) {
            if (c !== a) {
              return b;
            } else {
              return d;
            }
          });
          u.current = b;
          if (j) {
            j("0", b);
          }
        }
      }
      function V(d) {
        for (var a = p[d].sectionText.length - 1, b = 0; b < p[d].sectionText.length; b++) {
          if (!u.current || !u.current[d] || !u.current[d][b]) {
            return b;
          }
        }
        return a;
      }
      var J = JSON.parse(JSON.stringify(h));
      function K(f) {
        if (k) {
          if (i) {
            var b = r && r[f] ? r[f] : "";
            var c = h[f];
            if (g === 1) {
              var d = J.findIndex(function (c) {
                return c === b;
              });
              if (d > -1) {
                J.splice(d, 1);
                return "rightBlank";
              } else {
                return "wrongBlank";
              }
            }
            var e = (0, v.isEmpty)(b);
            if ((b !== c || e) && l) {
              return "wrongBlank";
            } else if (b === c) {
              return "rightBlank";
            } else {
              return "";
            }
          }
          return "rightBlank";
        }
        if (u.current && u.current[f] || B.inputIndex === f) {
          return "hasContent";
        } else {
          return "";
        }
      }
      var H = `${a.blankInput}${q ? " " + a.showInput : ""}`;
      return ca().createElement("div", {
        className: a.blankTextBox
      }, ca().createElement("div", {
        ref: t
      }, function () {
        var g = m || "";
        var b = g.match(/#(\d+)#/gi);
        if (b) {
          b.forEach(function (a, b) {
            var c;
            c = b;
            var d = u.current[c].length === 0 ? ` <span
          class="titleGap ${K(c)}"
          style="opacity:${o ? 0.5 : 1}${`"
        >
          `}${"  ".split("").map(function (d, a) {
              return `<span
                key="${s} - ${c}-${a}${`"
                data-type="space-box"
                data-index="`}${c}${`"
                class="blanksDetail"
                id="gap-`}${c}-${a}${`"
              >
                `}${u.current[c] && u.current[c][a] || ""}
              </span>`;
            }).join("")}
        </span>` : ` <span
        class="titleGap ${K(c)}"
        style="opacity:${o ? 0.5 : 1}${`"
      >
        `}${u.current[c].split("").map(function (d, a) {
              return `<span
              key="${s} - ${c}-${a}${`"
              data-type="space-box"
              data-index="`}${c}${`"
              class="blanksDetail answerBlanksDetail"
              id="gap-`}${c}-${a}${`"
            >
              `}${u.current[c] && u.current[c][a] || ""}
            </span>`;
            }).join("")}
      </span>`;
            g = g.replace(a, d);
          });
        }
        return ca().createElement(y.Z, {
          text: String.raw(e || (e = (0, I.Z)(["", ""])), g)
        });
      }()), ca().createElement("input", {
        className: H,
        ref: x,
        type: "text",
        maxLength: 30,
        onChange: function (a) {
          if (!k) {
            var b = function (d) {
              var a = d.trim();
              var e = true;
              if (a.indexOf("：") > -1 || a.indexOf(":") > -1) {
                a = a.replace(/\uff1a|:/g, "");
                e = false;
              }
              return {
                allValid: e,
                value: a
              };
            }(a.target.value);
            var c = b.allValid;
            var d = b.value;
            O(d);
            if (!c) {
              Q(false);
            }
            if (!(q && c)) {
              G(d, B.inputIndex);
            }
          }
        },
        value: M,
        onCompositionStart: function (b) {
          if (!k) {
            Q(true);
          }
        },
        onCompositionEnd: function () {
          if (!k) {
            Q(false);
            G(M, B.inputIndex);
          }
        },
        disabled: o
      }));
    });
    Q(8248);
    var N = Q(63468);
    var ia = Q(69134);
    var ja = (0, da.Z)(s)(function (l) {
      var b = l.classes;
      var c = l.description;
      var d = l.viewAnswerTipsState;
      var e = l.changeViewAnswerTipsState;
      var m = l.fileUrl;
      var a = l.isOpenAnswer;
      var f = "";
      if (m) {
        var g = m.lastIndexOf("/");
        f = m.substring(g + 1);
      }
      var i = a && e;
      var j = i || m || d ? b.promptWrap : "";
      return ca().createElement("div", {
        className: j
      }, i && ca().createElement("div", {
        className: b.prompt,
        onClick: function () {
          return e && e(true);
        }
      }, ca().createElement("div", {
        className: b.promptIcon
      }), ca().createElement("div", null, (0, ia.vs)("examDetail_prompt_tip"))), m ? ca().createElement("div", {
        onClick: function () {
          var d = m.substr(0, 4).toLowerCase() === "http" ? m || "" : `${N.dM.API_PREFIX}/${m}`;
          if ((0, k.w1)()) {
            var a = document.createElement("a");
            a.setAttribute("href", d);
            a.setAttribute("download", f);
            a.text = "";
            document.body.appendChild(a);
            a.click();
          } else {
            var g = new XMLHttpRequest();
            g.open("GET", d, true);
            g.responseType = "blob";
            g.onload = function (a) {
              var b = window.URL.createObjectURL(g.response);
              var c = document.createElement("a");
              c.href = b;
              c.download = f;
              c.click();
            };
            g.send();
          }
        },
        className: `${b.prompt} ${b.downloadBtn}`
      }, ca().createElement("div", {
        className: `${b.promptIcon} ${b.downloadIcon}`
      }), ca().createElement("div", null, (0, ia.vs)("examDetail_download_exam"))) : null, i && d && ca().createElement("div", {
        className: b.promptModal
      }, ca().createElement("div", {
        className: b.promptTitle
      }, ca().createElement("div", null, (0, ia.vs)("examDetail_tip_info")), ca().createElement("div", {
        className: b.close,
        onClick: function () {
          return e && e(false);
        }
      })), ca().createElement("div", {
        className: b.mes
      }, ca().createElement("span", {
        dangerouslySetInnerHTML: {
          __html: c || (0, ia.vs)("no_data")
        }
      }))));
    });
    var $a = Q(24145);
    var M = (0, da.Z)(s)(function (b) {
      var c = b.classes;
      var e = b.currentSubject;
      var F = b.onSelectOption;
      var n = b.isViewErrorQuestions;
      var a = b.currentIndex;
      var i = b.answerList;
      var q = b.isFromResult;
      var o = b.changeViewAnswerTipsState;
      var l = b.viewAnswerTips;
      var r = b.isOpenAnswer;
      b.setActiveVoiceId;
      var m = b.disabled;
      var d = b.isShowAnswer;
      var p = b.isMainTopic;
      var s = p === undefined || p;
      var g = $a.Z.examStage === ea.Bc.errorQuestions && d === 1;
      var f = {
        currentSubject: e,
        onSelectOption: F,
        answerList: i,
        currentIndex: a,
        sectionRespList: e.sectionRespList,
        isViewErrorQuestions: n,
        isFromResult: q,
        disabled: m,
        showAnswerStatus: g
      };
      var h = e.questionText;
      var t = h === undefined ? "" : h;
      var v = e.image;
      var x = v === undefined ? "" : v;
      var A = e.answerTip;
      var C = A === undefined ? "" : A;
      var E = e.fileUrl;
      var L = E === undefined ? "" : E;
      var D = e.questionType;
      var M = (0, ba.useState)(false);
      var N = (0, ga.Z)(M, 2);
      var z = N[0];
      var O = N[1];
      var P = (0, ba.useState)(false);
      var G = (0, ga.Z)(P, 2);
      var Q = G[0];
      var J = G[1];
      var K = "img";
      function R() {
        if (K === "video") {
          J(!z);
        }
        O(function (b) {
          return !b;
        });
      }
      function T(c) {
        var a = c.split(".");
        return !(a[a.length - 1].toLowerCase() !== "mp3" || !(0, k.w1)());
      }
      return ca().createElement("div", {
        className: c.questionText,
        style: {
          marginBottom: `${n ? "0" : "30px"}`
        }
      }, ca().createElement("div", null, ca().createElement("div", {
        className: ha()((0, fa.Z)({}, c.hasResource, !!x && !T(x)), (0, fa.Z)({}, c.hasIEResource, !!x && T(x)), c.questionTitle)
      }, !s && ca().createElement("span", {
        className: c.subjectType
      }, ea.tX[D || ""]), e.questionType === ea.ce.FILL_IN_BLANK ? ca().createElement(S, f) : ca().createElement("div", {
        className: c.flexBlock
      }, `${s ? "" : `（${a + 1}）`}`, ca().createElement(y.Z, {
        text: String.raw(B || (B = (0, I.Z)(["", ""])), t),
        isSpan: false
      }))), ca().createElement(ja, {
        isOpenAnswer: r === ea.Vq.YES,
        description: C,
        viewAnswerTipsState: l,
        changeViewAnswerTipsState: o,
        fileUrl: L
      })), x && ca().createElement("div", {
        style: {
          width: `${T(x) ? "550px" : "auto"}`
        }
      }, function () {
        var d = x.split(".");
        var a = d[d.length - 1].toLowerCase();
        if (a === "png" || a === "jpg") {
          return ca().createElement("div", {
            className: c.videoWrap,
            style: {
              width: "270px"
            }
          }, ca().createElement("div", {
            className: c.image,
            style: {
              backgroundImage: `url(${x}) `
            }
          }), ca().createElement("div", {
            className: c.previewIcon,
            onClick: R
          }));
        } else if (a === "mp3") {
          return ca().createElement("audio", {
            controls: true,
            controlsList: "nodownload",
            preload: "auto",
            style: {
              width: 270
            }
          }, (0, ia.vs)("examDetail_not_supported_audio"), ca().createElement("source", {
            type: "audio/mpeg",
            src: x
          }));
        } else if (a === "mp4") {
          K = "video";
          return ca().createElement("div", {
            className: c.videoWrap,
            onClick: R,
            style: {
              width: "270px",
              height: "152px"
            }
          }, ca().createElement("div", {
            className: c.playIcon
          }, ca().createElement("div", {
            className: c.play
          })), ca().createElement(u.Z, {
            className: c.videoPlayer,
            playUrl: x,
            pauseVideo: Q,
            controls: false,
            width: 270,
            height: 152
          }));
        } else {
          return undefined;
        }
      }()), ca().createElement(w, {
        visible: z,
        resourceUrl: x,
        type: K,
        closeModal: R
      }));
    });
    var D = Q(27853);
    var z = Q(84531);
    var E = Q(51937);
    var F = Q(13094);
    var G = Q(916);
    var O = Q(41260);
    var J = Q(37002);
    (function (b) {
      b.PLAY = "play";
      b.ENDED = "ended";
      b.PAUSE = "pause";
    })(A || (A = {}));
    var K;
    var P;
    var R = {
      playStatus: A.PAUSE
    };
    var U = function (a) {
      (0, E.Z)(c, a);
      var e = (0, F.Z)(c);
      function c() {
        var h;
        (0, D.Z)(this, c);
        for (var d = arguments.length, a = new Array(d), f = 0; f < d; f++) {
          a[f] = arguments[f];
        }
        (h = e.call.apply(e, [this].concat(a))).state = R;
        h.watchStatus = function () {
          var b = document.getElementById(h.props.id);
          if (b) {
            b.addEventListener("playing", function () {
              h.setState({
                playStatus: A.PLAY
              });
            }, false);
            b.addEventListener("pause", function () {
              h.setState({
                playStatus: A.PAUSE
              });
            }, false);
            b.addEventListener("ended", function () {
              h.setState({
                playStatus: A.ENDED
              });
            }, false);
          }
        };
        h.checkPlay = function (a) {
          if (h.props.voiceUrl) {
            a.stopPropagation();
            a.cancelBubble = true;
            var b = document.getElementById(h.props.id) || null;
            if (b && +b.readyState === 4) {
              b.currentTime = 0;
              h.props.setActiveVoiceId(h.props.id);
            } else {
              Q.g.$message((0, ia.vs)("examDetail_voice_loading"));
            }
          } else {
            Q.g.$message((0, ia.vs)("examDetail_try_later_audio"));
          }
        };
        h.onEnded = function () {
          h.setState({
            playStatus: A.ENDED
          });
        };
        h.onPlay = function () {
          h.setState({
            playStatus: A.PLAY
          });
        };
        h.onPause = function () {
          h.setState({
            playStatus: A.PAUSE
          });
        };
        h.getAudio = function (b, a) {
          if (b) {
            return ca().createElement("audio", {
              id: a,
              controls: false,
              onEnded: h.onEnded,
              onPlay: h.onPlay,
              onPause: h.onPause,
              controlsList: "nodownload",
              preload: "auto",
              key: a
            }, ca().createElement("source", {
              type: "audio/mpeg",
              src: b
            }));
          } else {
            return null;
          }
        };
        return h;
      }
      (0, z.Z)(c, [{
        key: "componentDidMount",
        value: function () {
          this.watchStatus();
        }
      }, {
        key: "componentWillReceiveProps",
        value: function (a) {
          var b = this.props;
          var c = b.id;
          if (b.className === "questionVoice" && c !== a.id) {
            var d = document.getElementById(c);
            if (d) {
              d.pause();
              this.setState({
                playStatus: A.PAUSE
              });
            }
          }
        }
      }, {
        key: "render",
        value: function () {
          var i = this;
          var b = this.props;
          var c = b.className;
          var d = b.classes;
          var e = b.voiceUrl;
          var a = b.id;
          var f = b.showText;
          var g = this.state.playStatus;
          return ca().createElement("div", {
            className: ha()(d[`${c}`], d.voiceDefault, `${f ? g === A.PLAY ? d.voiceWrapActive : d.voiceWrap : ""}`)
          }, ca().createElement("div", {
            onClick: function (b) {
              return i.checkPlay(b);
            }
          }, ca().createElement("span", {
            className: ha()("voiceIcon", d.voiceIconDefault, `${c === "questionVoice" ? d.voiceIconActive : d.sectionPlace}`, `${g === A.PLAY ? d.sectionActive : d.sectionWrap}`)
          }), f && ca().createElement("span", {
            className: d.voiceText
          }, (0, ia.vs)("examDetail_voice_reading")), this.getAudio(e, a)));
        }
      }]);
      return c;
    }(ba.Component);
    var V = (0, da.Z)(function (b) {
      return (0, c.Z)({
        voiceDefault: {
          display: "inline-block",
          fontSize: "14px",
          padding: "3px 5px",
          borderRadius: "2px",
          "& .voiceIcon": {
            backgroundSize: "100% 100%",
            display: "inline-block"
          },
          "&:hover": {
            "& .voiceIcon": {
              background: `url(${J}) no-repeat`,
              backgroundSize: "100% 100%"
            }
          }
        },
        sectionActive: {
          background: `url(${O}) no-repeat`,
          backgroundSize: "100% 100%",
          "&:hover": {
            "&.voiceIcon": {
              background: `url(${O}) no-repeat`,
              backgroundSize: "100% 100%"
            }
          }
        },
        sectionWrap: {
          background: `url(${G}) no-repeat`,
          backgroundSize: "100% 100%",
          "&:hover": {
            "&.voiceIcon": {
              background: `url(${J}) no-repeat`,
              backgroundSize: "100% 100%"
            }
          }
        },
        playBackground: {
          background: `url(${O}) no-repeat`,
          backgroundSize: "100% 100%"
        },
        defaultBackground: {
          background: `url(${G}) no-repeat`,
          backgroundSize: "100% 100%"
        },
        voiceIconDefault: {
          width: 14,
          height: 14
        },
        voiceIconActive: {
          position: "relative",
          top: "2px"
        },
        sectionPlace: {
          position: "relative",
          top: "1px"
        },
        voiceWrap: {
          border: "1px solid #333333",
          color: "#333333",
          "&:hover": {
            cursor: "pointer",
            border: "1px solid #1890FF",
            color: "#1890FF"
          }
        },
        voiceWrapActive: {
          border: "1px solid #1890FF",
          color: "#1890FF",
          "&:hover": {
            cursor: "pointer",
            border: "1px solid #1890FF",
            color: "#1890FF",
            "& .voiceIcon": {
              background: `url(${O}) no-repeat`,
              backgroundSize: "100% 100%"
            }
          }
        },
        questionVoice: {
          display: "inline-block",
          marginBottom: "3px"
        },
        voiceText: {
          marginLeft: "4px"
        },
        answerVoice: {
          display: "inline-block",
          padding: "7px 10px",
          position: "relative",
          left: "3px"
        }
      });
    })(U);
    var ka = (0, da.Z)(s)(function (b) {
      var p = b.classes;
      var f = b.answerList;
      var c = b.onSelectOption;
      var d = b.sectionRespList;
      var g = b.isViewErrorQuestions;
      var h = b.currentSubject;
      var j = b.disabled;
      var k = b.isOpenRead;
      var n = b.setActiveVoiceId;
      var l = b.showAnswerStatus;
      return ca().createElement("div", {
        className: p.options
      }, d.map(function (d, a) {
        var b = d.isCorrect === "Y" && l;
        var e = (h.myAnswer || []).find(function (a) {
          return a === d.sectionId;
        });
        var i = f && f.find(function (a) {
          return a === d.sectionId;
        });
        return ca().createElement("div", {
          className: ha()(p.option, (0, fa.Z)({}, p.selectedOption, i), (0, fa.Z)({}, p.errorBorderColor, g && e && l), (0, fa.Z)({}, p.correctOptions, g && b)),
          style: {
            opacity: j ? 0.5 : 1
          },
          key: d.sectionId,
          onClick: function () {
            if (!j) {
              if (c) {
                c({
                  sectionId: d.sectionId,
                  childId: d.questionId
                });
              }
            }
          }
        }, ca().createElement("div", {
          className: p.flexBlock
        }, `${d.optionNo}.`, ca().createElement(y.Z, {
          text: String.raw(K || (K = (0, I.Z)(["", ""])), d.sectionText),
          isSpan: false
        })), ca().createElement("div", null, g && b && ca().createElement("div", {
          className: p.successIcon
        }), Boolean(k) && !g && ca().createElement(V, {
          setActiveVoiceId: n,
          voiceUrl: d.voiceUrl || "",
          id: `voice_${d.sectionId}`,
          className: "answerVoice",
          showText: false
        })));
      }));
    });
    var W = (0, da.Z)(s)(function (b) {
      var p = b.classes;
      b.currentIndex;
      var f = b.currentSubject;
      var g = b.answerList;
      var e = b.onSelectOption;
      var a = b.sectionRespList;
      var h = b.isViewErrorQuestions;
      var i = b.disabled;
      var j = b.isOpenRead;
      var k = b.setActiveVoiceId;
      var l = b.showAnswerStatus;
      return ca().createElement("div", {
        className: p.options
      }, (a || []).map(function (b, a) {
        var c = b.isCorrect === "Y" && l;
        var m = (f.myAnswer || []).find(function (c) {
          return c === b.sectionId;
        });
        var d = g && g.find(function (c) {
          return c === b.sectionId;
        });
        return ca().createElement("div", {
          className: ha()(p.option, (0, fa.Z)({}, p.selectedOption, d), (0, fa.Z)({}, p.errorBorderColor, h && m && l), (0, fa.Z)({}, p.correctOptions, h && c)),
          key: b.sectionId,
          style: {
            opacity: i ? 0.5 : 1
          },
          onClick: function () {
            if (!i) {
              if (e) {
                e({
                  sectionId: b.sectionId,
                  childId: b.questionId
                });
              }
            }
          }
        }, ca().createElement("div", {
          className: p.checkBoxWrap
        }, !h && ca().createElement("div", {
          className: d ? p.checkedBox : p.checkBox
        }), ca().createElement("div", {
          className: `${p.flexContainer} ${p.flexBlock}`
        }, `${b.optionNo}.`, ca().createElement(y.Z, {
          text: String.raw(P || (P = (0, I.Z)(["", ""])), b.sectionText)
        }))), h && c && ca().createElement("div", {
          className: p.successIcon
        }), Boolean(j) && !h && ca().createElement(V, {
          setActiveVoiceId: k,
          voiceUrl: b.voiceUrl || "",
          id: `voice_${b.sectionId}`,
          className: "answerVoice",
          showText: false
        }));
      }));
    });
    var Y = Q(65658);
    var Z = Q(84322);
    var _ = Q.n(Z);
    var la = Q(33032);
    var ma = Q(10522);
    var na = Q(58971);
    var oa = Q.n(na);
    var pa = Q(66045);
    var qa = Q(73914);
    var ra = Q(56673);
    var sa = (0, qa.Z)(function (b) {
      return {
        progressWrapper: {
          display: "flex",
          alignItems: "center",
          "& .progress-body": {
            background: "#E5E5E5",
            borderRadius: "3.5px",
            width: 170,
            height: 6,
            "& .progress": {
              transition: "width 0.5s",
              borderRadius: "3.5px",
              background: b.palette.primary.main,
              height: "100%"
            }
          },
          "& .percent": {
            fontSize: "14px",
            marginLeft: "10px"
          }
        }
      };
    });
    function ta(b) {
      return ca().createElement("div", {
        className: sa().progressWrapper
      }, ca().createElement("div", {
        className: "progress-body"
      }, ca().createElement("div", {
        className: "progress",
        style: {
          width: b.percent
        }
      })), ca().createElement("div", {
        className: "percent"
      }, b.percent));
    }
    var ua = (0, qa.Z)(function (b) {
      return {
        row: {
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #e5e5e5",
          fontSize: 12,
          height: 44,
          lineHeight: "44px",
          paddingLeft: 20,
          color: "#666666",
          "&:hover": {
            backgroundColor: "#F5F5F5"
          }
        },
        img: {
          marginRight: 5
        },
        name: {
          width: 320,
          padding: "0 20px 0 0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        },
        header: {
          color: "#333333",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#ffffff"
          }
        },
        progress: {
          flex: 1
        },
        operate: {
          padding: "0 20px",
          cursor: "pointer",
          "&:hover": {
            color: b.palette.primary.main
          }
        },
        operateText: {
          padding: "0 20px"
        },
        disabled: {
          opacity: 0.5,
          cursor: "not-allowed",
          "&:hover": {
            color: "#666666"
          }
        }
      };
    });
    function va(n) {
      var b = n.filename;
      var c = n.progress;
      var e = c === undefined ? "" : c;
      var f = n.onDelete;
      var a = n.onDownload;
      var g = n.isHeader;
      var h = g !== undefined && g;
      var i = n.disabled;
      var j = i !== undefined && i;
      var k = n.uploading;
      var l = k !== undefined && k;
      var m = ua();
      if (h) {
        return ca().createElement("li", {
          className: ha()(m.row, m.header)
        }, ca().createElement("div", {
          className: m.name
        }, b), ca().createElement("div", {
          className: m.progress
        }), ca().createElement("div", {
          className: m.operateText
        }, (0, ia.vs)("operation")));
      } else {
        return ca().createElement("li", {
          className: m.row
        }, ca().createElement("img", {
          src: ra,
          alt: "",
          width: "14",
          height: "14",
          className: m.img
        }), ca().createElement("div", {
          className: m.name,
          onClick: a
        }, b), ca().createElement("div", {
          className: m.progress
        }, l && e ? ca().createElement(ta, {
          percent: e
        }) : null), ca().createElement("div", {
          className: ha()(m.operate, j && m.disabled),
          onClick: f
        }, l ? null : ca().createElement("span", null, (0, ia.vs)("delete"))));
      }
    }
    function wa(e) {
      var b = e.fileList;
      var h = e.onDel;
      var d = e.disabled;
      var f = e.previewAble;
      function a(d) {
        var a = d.lastIndexOf(".");
        var b = d.slice(a - 1);
        if (d.length > 25) {
          return `${d.slice(0, 15)}...${b}`;
        } else {
          return d;
        }
      }
      if (!b || (0, v.isEmpty)(b)) {
        return null;
      } else {
        return ca().createElement("ul", null, ca().createElement(va, {
          filename: (0, ia.vs)("enclosure_title"),
          isHeader: true
        }), b.map(function (e, b) {
          return ca().createElement(va, {
            key: b,
            filename: a(e.fileName),
            disabled: d,
            onDelete: function () {
              return h(b);
            },
            onDownload: function () {
              a = e.filePath;
              if (f) {
                window.open(`${N.dM.API_PREFIX}/${a}`);
              }
              return;
              var a;
            },
            progress: e.progress,
            uploading: e.uploading
          });
        }));
      }
    }
    var xa = Q(98544);
    var ya = function () {
      var a = (0, la.Z)(_().mark(function d(e, b, c) {
        return _().wrap(function (d) {
          for (;;) {
            switch (d.prev = d.next) {
              case 0:
                return d.abrupt("return", ma.Z.post(e, {
                  file: b
                }, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    sid: oa().get("sessionInfo").sid,
                    appDevicePlatform: N.dM.STR_OS
                  },
                  timeout: 60000,
                  onUploadProgress: c
                }));
              case 1:
              case "end":
                return d.stop();
            }
          }
        }, d);
      }));
      return function (b, c, d) {
        return a.apply(this, arguments);
      };
    }();
    function za(c) {
      var a = c.split(".");
      return a[a.length - 1].toLocaleLowerCase();
    }
    var Aa = {
      fileList: [],
      loading: false,
      showDel: 0,
      width: "0",
      uploadingIndex: -1,
      visible: false
    };
    var Ba = function (a) {
      (0, E.Z)(c, a);
      var e = (0, F.Z)(c);
      function c() {
        var l;
        (0, D.Z)(this, c);
        for (var d = arguments.length, a = new Array(d), f = 0; f < d; f++) {
          a[f] = arguments[f];
        }
        (l = e.call.apply(e, [this].concat(a))).state = Aa;
        l.inputRef = null;
        l.onDel = function (d) {
          if (!l.props.disabled) {
            var a = l.state.fileList.filter(function (a, b) {
              return b !== d;
            });
            l.setState({
              fileList: a
            });
            l.props.onChange(a);
          }
        };
        l.onInputChange = function () {
          var b = l.props.limit;
          if (l.state.fileList.length >= b) {
            l.setState({
              visible: true
            });
          } else if (l.inputRef) {
            l.inputRef.click();
          }
        };
        l.resetInputValue = function () {
          if (l.inputRef) {
            l.inputRef.value = "";
          }
        };
        l.listenProgress = function (b) {
          var c = b.total;
          var d = b.loaded;
          if (b.lengthComputable) {
            var e = `${(d * 100 / c).toFixed(0)}%`;
            l.updateFileList({
              progress: e
            });
          }
        };
        l.validateParam = function (b) {
          var c = l.props;
          var d = c.validate;
          var e = c.acceptPostfix;
          var f = c.limitSize;
          var a = c.limit;
          if (d) {
            return d(b);
          }
          var g = l.state.fileList;
          if ([].concat((0, Y.Z)(b), (0, Y.Z)(g)).length > a) {
            l.setState({
              visible: true
            });
            return false;
          } else {
            return !b.some(function (b) {
              if (e.includes(za(b.name))) {
                if (b.size === 0) {
                  Q.g.$message((0, ia.vs)("components_upload_files_empty"));
                  return true;
                } else {
                  return !!(b.size / 1048576 >= f) && (Q.g.$message((0, ia.vs)("components_upload_files_empty", {
                    limitSize: f
                  })), true);
                }
              } else {
                Q.g.$message((0, ia.vs)("not_support_upload"));
                return true;
              }
            });
          }
        };
        l.setLoading = function (b) {
          return l.setState({
            loading: b
          });
        };
        l.updateFileList = function (b) {
          var c = arguments.length > 1 && arguments[1] !== undefined && arguments[1];
          var d = l.state;
          var e = d.fileList;
          var a = d.uploadingIndex;
          var f = (0, aa.Z)((0, aa.Z)({}, e[a]), b);
          var g = e.slice();
          g.splice(a, 1, f);
          l.setState({
            fileList: g
          });
          if (c) {
            l.props.onChange(g);
          }
        };
        l.onChange = function () {
          var c = (0, la.Z)(_().mark(function c(b) {
            var d;
            var e;
            var f;
            var g;
            var i;
            var m;
            var o;
            var p;
            var r;
            var s;
            var t;
            var u;
            var A;
            return _().wrap(function (c) {
              for (;;) {
                switch (c.prev = c.next) {
                  case 0:
                    d = b.currentTarget;
                    e = l.props.action;
                    if (!(d && d.files && d.files.length && d.files.length > 0)) {
                      c.next = 47;
                      break;
                    }
                    f = Array.from(d.files);
                    if (l.validateParam(f)) {
                      c.next = 7;
                      break;
                    }
                    l.resetInputValue();
                    return c.abrupt("return");
                  case 7:
                    g = f.map(function (b) {
                      return {
                        filePath: "",
                        fileName: b.name,
                        fileType: b.type,
                        uploading: true,
                        progress: "0%"
                      };
                    });
                    i = l.state.fileList;
                    m = i.length;
                    l.setState({
                      fileList: [].concat((0, Y.Z)(i), (0, Y.Z)(g))
                    });
                    o = 0;
                  case 12:
                    if (!(o < f.length)) {
                      c.next = 47;
                      break;
                    }
                    p = f[o];
                    if (l.props.isUniqueUpload) {
                      l.resetInputValue();
                    }
                    (r = new FormData()).append("file", p);
                    Q.g.$showLoading(true);
                    l.setLoading(true);
                    c.prev = 19;
                    l.setState({
                      uploadingIndex: m + o
                    });
                    c.next = 23;
                    return ya(e, r, l.listenProgress);
                  case 23:
                    if (+(s = c.sent).code === 0) {
                      c.next = 33;
                      break;
                    }
                    Q.g.$message(s.message);
                    Q.g.$showLoading(false);
                    (t = l.state.fileList.slice()).splice(m + o, 1);
                    m -= 1;
                    l.setState({
                      loading: false,
                      fileList: t
                    });
                    l.props.onChange(t);
                    return c.abrupt("continue", 44);
                  case 33:
                    u = {
                      filePath: s.body,
                      uploading: false
                    };
                    l.updateFileList(u, true);
                    Q.g.$showLoading(false);
                    l.setState({
                      loading: false
                    });
                    c.next = 43;
                    break;
                  case 39:
                    c.prev = 39;
                    c.t0 = c.catch(19);
                    A = c.t0.message.includes("timeout") ? (0, ia.vs)("components_upload_time_out") : (0, ia.vs)("components_net_error");
                    Q.g.$message(A);
                  case 43:
                    l.setState({
                      width: "0",
                      loading: false
                    });
                  case 44:
                    o++;
                    c.next = 12;
                    break;
                  case 47:
                  case "end":
                    return c.stop();
                }
              }
            }, c, null, [[19, 39]]);
          }));
          return function (a) {
            return c.apply(this, arguments);
          };
        }();
        return l;
      }
      (0, z.Z)(c, [{
        key: "render",
        value: function () {
          var f = this;
          var b = this.props;
          var c = b.disabled;
          var e = c !== undefined && c;
          var h = b.multiple;
          var a = h !== undefined && h;
          var i = b.label;
          var j = b.classes;
          var k = b.accept;
          var n = b.limit;
          var l = b.previewAble;
          var o = this.state;
          var m = o.loading;
          var d = o.visible;
          var p = o.fileList;
          var q = p === undefined ? [] : p;
          return ca().createElement(ca().Fragment, null, ca().createElement("section", {
            className: j.fileContainer
          }, ca().createElement("aside", {
            className: j.upload
          }, ca().createElement("div", {
            onClick: this.onInputChange,
            className: ha()(j.uploadBtn, e && j.disabled)
          }, ca().createElement("span", null, m ? (0, ia.vs)("components_uploading") : i)), ca().createElement("input", {
            ref: function (b) {
              return f.inputRef = b;
            },
            type: "file",
            id: "upload",
            onChange: this.onChange,
            accept: k,
            disabled: e || m,
            multiple: a
          }))), ca().createElement("section", null, ca().createElement(wa, {
            fileList: q,
            onDel: this.onDel,
            disabled: e,
            previewAble: l
          })), ca().createElement(pa.Z, {
            showClose: false,
            onOk: function () {
              f.setState({
                visible: false
              });
            },
            visible: d,
            content: (0, ia.vs)("components_uploadNumLimit", {
              limit: n
            }),
            confirmAndCancel: false,
            okText: (0, ia.vs)("i_got_it")
          }));
        }
      }], [{
        key: "getDerivedStateFromProps",
        value: function (c, a) {
          if (!a.fileList || (0, v.isEmpty)(a.fileList)) {
            return {
              fileList: c.fileList
            };
          } else {
            return null;
          }
        }
      }]);
      return c;
    }(ca().PureComponent);
    Ba.defaultProps = {
      fileList: [],
      acceptPostfix: ["jpeg", "jpg", "png"],
      limitSize: 5,
      limit: 9,
      multiple: true,
      isUniqueUpload: true,
      previewAble: false
    };
    var Ca;
    var _a = (0, da.Z)(function (b) {
      return (0, c.Z)({
        fileContainer: {
          display: "flex",
          marginTop: "10px",
          marginBottom: "8px",
          fontSize: "14px",
          color: "#4E8FFF",
          "& .upload": {
            width: 109,
            color: "#333333",
            textAlign: "right"
          }
        },
        upload: {
          position: "relative",
          fontSize: "14px",
          color: "#666",
          "& input": {
            cursor: "pointer",
            width: 106,
            height: 0,
            position: "absolute",
            left: 0,
            top: 0,
            opacity: 0,
            zIndex: 0
          },
          "& p": {
            fontSize: 12,
            color: "#CCCCCC"
          }
        },
        box: {
          backgroundColor: b.palette.secondary.main,
          border: "1px solid #D9D9D9",
          borderRadius: 4,
          zIndex: 1,
          width: 104,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
          cursor: "pointer",
          "& i": {
            display: "block",
            width: 14,
            height: 14,
            background: `url(${xa}) no-repeat 0 0/14px 14px`,
            marginRight: 8
          }
        },
        uploadBtn: {
          backgroundColor: b.palette.primary.main,
          color: b.palette.secondary.main,
          borderRadius: 2,
          zIndex: 1,
          padding: "0 5px",
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
          cursor: "pointer"
        },
        disabled: {
          opacity: 0.5,
          cursor: "not-allowed"
        }
      });
    })(Ba);
    (function (b) {
      b[b.CLOSE = 0] = "CLOSE";
      b[b.OPEN = 1] = "OPEN";
    })(Ca || (Ca = {}));
    var Ea = (0, da.Z)(s)(function (G) {
      var c = G.classes;
      var e = G.currentSubject;
      var j = G.onSelectOption;
      var k = G.isViewErrorQuestions;
      var a = G.answerList;
      var i = G.isFromResult;
      var n = G.isPhotoAnswer;
      var o = G.images;
      var l = o === undefined ? [] : o;
      var q = G.disabled;
      var m = G.showAnswerStatus;
      var d = (0, ba.useState)([]);
      var p = (0, ga.Z)(d, 2);
      var r = p[0];
      var g = p[1];
      var f = (0, ba.useState)("#F5F5F5");
      var h = (0, ga.Z)(f, 2);
      var s = h[0];
      var t = h[1];
      var u = (0, ba.useState)("#B2B2B2");
      var v = (0, ga.Z)(u, 2);
      var w = v[0];
      var b = v[1];
      var x = e.keyword;
      var z = e.myAnswer;
      var y = (0, ba.useState)(k ? "" : a && a.length > 0 ? a[0] : "");
      var A = (0, ga.Z)(y, 2);
      var C = A[0];
      var E = A[1];
      (0, ba.useEffect)(function () {
        var b = l.map(function (d) {
          var a = d;
          var b = d.lastIndexOf("/");
          return {
            filePath: a,
            fileType: "image/jpg",
            fileName: d.substring(b + 1)
          };
        });
        g(b);
        document.oncontextmenu = function (b) {
          b.preventDefault();
        };
        document.onselectstart = function (b) {
          b.preventDefault();
        };
        document.onpaste = function () {
          return false;
        };
        document.oncopy = function () {
          return false;
        };
        document.oncut = function () {
          return false;
        };
      }, []);
      var B = (0, ba.useCallback)(function () {
        t(C ? "#FFFFFF" : "#F5F5F5");
        if (j) {
          var b = r.map(function (b) {
            return b.filePath;
          });
          j({
            sectionId: C,
            childId: e.questionId
          }, undefined, b);
        }
      }, [C]);
      var F = (0, ba.useCallback)(function () {
        return t("#FFFFFF");
      }, []);
      return ca().createElement("div", {
        className: c.questionAndAnswer
      }, k ? ca().createElement("div", null, i && m ? ca().createElement(ca().Fragment, null, ca().createElement("div", {
        className: c.myAnswerTitle
      }, (0, ia.vs)("examDetail_my_answers")), ca().createElement("div", {
        className: c.myAnswerBox,
        style: {
          paddingBottom: "14px"
        },
        dangerouslySetInnerHTML: {
          __html: function (c, a) {
            return c.replace(`${a}/g`, `<span style={ color='#52C41A'}>${a}</span>`);
          }(z && z[0] || (0, ia.vs)("examDetail_no_answer"), x || "")
        }
      })) : ca().createElement("div", {
        className: c.myAnswerBox
      }), ca().createElement("div", {
        className: c.referAnswerTitle
      }, (0, ia.vs)("examDetail_reference_answer_colon")), ca().createElement("div", {
        className: c.referAnswer
      }, e.referAnswer ? ca().createElement("div", {
        dangerouslySetInnerHTML: {
          __html: e.referAnswer.replace(/\n/g, "<br/>")
        }
      }) : null)) : ca().createElement(ca().Fragment, null, ca().createElement("div", {
        className: c.textareaWrap,
        style: {
          backgroundColor: s
        }
      }, ca().createElement("textarea", {
        placeholder: q ? "" : zn_t_intelligent_portal("42a26db5", "请在此输入答案"),
        className: c.questionInput,
        onChange: function (c) {
          var a = c.target.value || "";
          if (a.length >= 1000) {
            b("#FA534A");
          }
          if (!a.match(/[@]/g)) {
            E(a);
          }
        },
        maxLength: 1000,
        value: C,
        onFocus: F,
        onBlur: B,
        disabled: q
      }), ca().createElement("div", {
        className: c.answerLength
      }, ca().createElement("span", {
        style: {
          color: w
        }
      }, C.length, "/1000"))), n === Ca.OPEN && ca().createElement(ca().Fragment, null, ca().createElement("p", {
        className: c.tip
      }, (0, ia.vs)("examDetail_uploadImageTip")), ca().createElement(_a, {
        label: (0, ia.vs)("examDetail_uploadImage"),
        accept: "image/jpeg,image/jpg,image/png",
        onChange: function (c) {
          var a = c.map(function (b) {
            return b.filePath;
          });
          g(c);
          if (j) {
            j({
              sectionId: C,
              childId: e.questionId
            }, undefined, a);
          }
        },
        fileList: r,
        disabled: q,
        previewAble: true,
        action: "/learn/app/clientapi/exam/new/uploadImage.do"
      })) || null));
    });
    var Fa = Q(46772);
    var Ga = (0, da.Z)(s)(function (r) {
      var s = r.classes;
      r.currentIndex;
      var c = r.currentSubject;
      var j = r.answerList;
      var k = r.onSelectOption;
      var a = r.sectionRespList;
      var t = r.isViewErrorQuestions;
      var i = r.disabled;
      var n = r.showAnswerStatus;
      var b = (0, ba.useState)(false);
      var e = (0, ga.Z)(b, 2);
      var l = e[0];
      var d = e[1];
      var m = (0, ba.useState)("");
      var o = (0, ga.Z)(m, 2);
      var g = o[0];
      var f = o[1];
      return ca().createElement("div", {
        className: ha()(s.options, s.imageOptions)
      }, (a || []).map(function (h, a) {
        var b = h.isCorrect === "Y" && n;
        var e = (c.myAnswer || []).find(function (b) {
          return b === h.sectionId;
        });
        var g = j && j.find(function (b) {
          return b === h.sectionId;
        });
        return ca().createElement("div", {
          key: h.sectionId
        }, ca().createElement("div", {
          className: ha()(s.imgQuestionWrap, (0, fa.Z)({}, s.selectedOption, g)),
          style: {
            opacity: i ? 0.5 : 1
          },
          onClick: function () {
            if (!i) {
              if (k) {
                k(h.sectionId);
              }
            }
          }
        }, ca().createElement("div", {
          className: ha()(s.imgWrap, (0, fa.Z)({}, s.selectedImage, g), (0, fa.Z)({}, s.errorBorderColor, t && e && n), (0, fa.Z)({}, s.correctBorderColor, t && b))
        }, ca().createElement("div", {
          className: s.previewIcon,
          onClick: function (b) {
            return function (c, a) {
              c.stopPropagation();
              f(a);
              d(true);
            }(b, h.resourceUrl);
          }
        }), ca().createElement("img", {
          className: s.imgAnswer,
          src: h.resourceUrl,
          onError: function (b) {
            return function (b) {
              b.target.src = Fa;
            }(b);
          }
        })), ca().createElement("div", {
          className: s.imgNum
        }, h.optionNo)));
      }), ca().createElement(w, {
        visible: l,
        resourceUrl: g,
        type: "img",
        closeModal: function () {
          return d(false);
        }
      }));
    });
    var Ha = Q(33146);
    var Ia = Q(53655);
    var Ja = Q(45342);
    var Ka = Q(88683);
    var La = function (d) {
      (0, E.Z)(b, d);
      var a = (0, F.Z)(b);
      function b(c) {
        var l;
        (0, D.Z)(this, b);
        (l = a.call(this, c)).setList = function () {
          var c = (0, la.Z)(_().mark(function a(c) {
            var f;
            var n;
            var o;
            var q;
            var i;
            var b;
            var r;
            return _().wrap(function (a) {
              for (;;) {
                switch (a.prev = a.next) {
                  case 0:
                    c.map(function (b) {
                      b.rightAnswer = [];
                      b.status = "";
                    });
                    a.next = 3;
                    return l.setState({
                      listLeft: x().sortBy(c.filter(function (b) {
                        return b.ligatureType !== "b";
                      }), "sortNo"),
                      listRight: x().sortBy(c.filter(function (b) {
                        return b.ligatureType !== "a";
                      }), "sortNo")
                    });
                  case 3:
                    f = l.state;
                    n = f.lineArr;
                    o = f.listLeft;
                    q = f.listRight;
                    if ((i = l.props.answerList) && i.length > 0) {
                      i.forEach(function (c) {
                        o.map(function (a) {
                          return a.sectionId === c.split(":")[0] && a.rightAnswer.push(c.split(":")[1]);
                        });
                      });
                      b = document.getElementsByClassName("lineTop")[0];
                      r = b.offsetTop;
                      i.forEach(function (d) {
                        var b = o.findIndex(function (b) {
                          return b.sectionId === d.split(":")[0];
                        });
                        var e = q.findIndex(function (b) {
                          return b.sectionId === d.split(":")[1];
                        });
                        var f = document.getElementsByClassName("lOption")[b];
                        var g = document.getElementsByClassName("rOption")[e];
                        var a = f.offsetTop;
                        var h = f.offsetHeight;
                        var c = g.offsetTop;
                        var i = g.offsetHeight;
                        n.push({
                          left: a - r + h / 2,
                          right: c - r + i / 2,
                          leftSectionId: d.split(":")[0],
                          rightSectionId: d.split(":")[1],
                          view: true
                        });
                      });
                    }
                    l.setState({
                      lineArr: n,
                      listLeft: o
                    });
                    l.createCanvas(n);
                    l.operateStatus("create");
                  case 9:
                  case "end":
                    return a.stop();
                }
              }
            }, a);
          }));
          return function (a) {
            return c.apply(this, arguments);
          };
        }();
        l.createCanvas = function (a) {
          var b = document.getElementById("drawing");
          var c = document.getElementsByClassName("lineTop")[0].offsetHeight;
          if (b && b.height === 150) {
            b.height = c;
          }
          var d = b.getContext("2d");
          if (d) {
            d.clearRect(0, 0, 160, b.height);
            if (a.length === 0) {
              return;
            }
            a.forEach(function (b) {
              d.strokeStyle = "#A7D5FF";
              d.lineWidth = 2;
              d.beginPath();
              d.moveTo(0, b.left);
              if (b.right) {
                d.lineTo(160, b.right);
              }
              d.stroke();
            });
          }
        };
        l.clearCanvas = function () {
          var c = document.getElementById("drawing");
          var a = c.getContext("2d");
          if (a) {
            a.clearRect(0, 0, 160, c.height);
          }
        };
        l.handle = function (f, a, b) {
          var c = l.state;
          var d = c.listLeft;
          var e = c.lineArr;
          if (b === "left") {
            l.createArr(f, a, b);
            l.setListStatus(a, b);
          }
          if (b === "right") {
            if (e.length !== 0 && (e[e.length - 1].view || e[e.length - 1].right)) {
              return;
            }
            if (e.length !== 0 && e[e.length - 1].left) {
              d.forEach(function (c) {
                if (c.sectionId === e[e.length - 1].leftSectionId) {
                  if (!c.rightAnswer.find(function (a) {
                    return a === f.sectionId;
                  })) {
                    c.rightAnswer.push(f.sectionId);
                    l.createArr(f, a, b);
                    l.setListStatus(a, b);
                    l.setAnswer();
                  }
                }
              });
            }
          }
        };
        l.setAnswer = function () {
          var c = l.state.lineArr;
          var d = [];
          c.forEach(function (b) {
            if (b.rightSectionId) {
              d.push(`${b.leftSectionId}:${b.rightSectionId}`);
            }
          });
          if (l.props.onSelectOption) {
            l.props.onSelectOption("", [], [], d);
          }
        };
        l.createArr = function (f, a, b) {
          var d = l.state.lineArr;
          var e = document.getElementsByClassName("lineTop")[0];
          var g = document.getElementsByClassName(`${b === "left" ? "lOption" : "rOption"}`)[a];
          var h = e.offsetTop;
          var i = g.offsetTop;
          var j = g.offsetHeight;
          if (b === "left") {
            if (d.length === 0 || d[d.length - 1].right) {
              d.push({
                left: i - h + j / 2,
                leftSectionId: f.sectionId,
                right: 0,
                rightSectionId: "",
                view: false
              });
            } else {
              d[d.length - 1].left = i - h + j / 2;
              d[d.length - 1].leftSectionId = f.sectionId;
            }
          }
          if (b === "right") {
            d[d.length - 1].right = i - h + j / 2;
            d[d.length - 1].rightSectionId = f.sectionId;
          }
          l.setState({
            lineArr: d
          });
        };
        l.setListStatus = function (f, a) {
          var b = l.state;
          var c = b.listLeft;
          var d = b.listRight;
          var e = b.lineArr;
          if (a === "left") {
            c.map(function (a, b) {
              return a.status = f === b ? a.rightAnswer.length > 0 ? "clickConnect" : "click" : a.rightAnswer.length > 0 ? "connect" : "";
            });
          }
          if (a === "right") {
            c.map(function (b) {
              return b.status = b.status === "clickConnect" || b.status === "click" ? "connect" : b.status;
            });
            l.createCanvas(e);
            l.setRightStatus();
          }
          l.setState({
            listLeft: c,
            listRight: d
          });
        };
        l.cancel = (0, la.Z)(_().mark(function f() {
          var i;
          var j;
          var k;
          var m;
          var a;
          var n;
          return _().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  i = l.state;
                  j = i.listLeft;
                  k = i.lineArr;
                  if (m = k.pop()) {
                    if (!m.rightSectionId) {
                      a = m;
                      m = k.pop();
                      k.push(a);
                    }
                    n = j.findIndex(function (b) {
                      return b.sectionId === m.leftSectionId;
                    });
                    j[n].rightAnswer = j[n].rightAnswer.filter(function (b) {
                      return b !== m.rightSectionId;
                    });
                    l.setState({
                      listLeft: j
                    }, function () {
                      l.operateStatus("cancel", n);
                      l.createCanvas(k);
                    });
                  }
                case 3:
                case "end":
                  return b.stop();
              }
            }
          }, f);
        }));
        l.operateStatus = function (f, a) {
          var b = l.state;
          var c = b.listLeft;
          var d = b.listRight;
          var e = b.lineArr;
          if (f === "cancel") {
            if (c[a || 0].rightAnswer.length === 0) {
              c[a || 0].status = c[a || 0].status === "clickConnect" ? "click" : "";
            }
            l.setRightStatus();
            l.setAnswer();
          }
          if (f === "clear") {
            e.length = 0;
            l.createCanvas(e);
            d.map(function (b) {
              return b.status = "";
            });
            c.map(function (b) {
              b.rightAnswer = [];
              b.status = "";
            });
            l.setAnswer();
          }
          if (f === "create") {
            c.map(function (b) {
              return b.status = b.rightAnswer && b.rightAnswer.length > 0 ? "connect" : "";
            });
            l.setRightStatus();
          }
          l.setState({
            listLeft: c,
            listRight: d
          });
        };
        l.setRightStatus = function () {
          var e = l.state;
          var a = e.listLeft;
          var b = e.listRight;
          var c = [];
          a.forEach(function (b) {
            c = c.concat(b.rightAnswer);
          });
          c = (0, Y.Z)(new Set(c));
          b.map(function (d) {
            var a = c.findIndex(function (a) {
              return d.sectionId === a;
            });
            return d.status = a === -1 ? "" : "connect";
          });
          l.setState({
            listRight: b
          });
        };
        l.state = {
          listLeft: [],
          listRight: [],
          lineArr: [],
          visible: false
        };
        return l;
      }
      (0, z.Z)(b, [{
        key: "componentDidMount",
        value: function () {
          this.setList(this.props.sectionRespList);
        }
      }, {
        key: "componentWillUnmount",
        value: function () {
          this.clearCanvas();
        }
      }, {
        key: "render",
        value: function () {
          var l = this;
          var b = this.state;
          var c = b.listLeft;
          var d = b.listRight;
          var e = b.lineArr;
          var a = b.visible;
          var f = this.props;
          var g = f.classes;
          var h = f.disabled;
          var i = f.setOperateVisible;
          var j = f.currentLength;
          return ca().createElement("div", {
            className: g.lineOptions
          }, ca().createElement("div", {
            className: `${g.lineOperate} ${h ? g.op0 : ""}`
          }, ca().createElement("div", {
            className: `${g.operateBtn} ${h || e.length === 0 ? "" : g.canUse}`,
            onClick: function () {
              if (!h) {
                if (e.length !== 0) {
                  l.setState({
                    visible: true
                  });
                  i(true);
                }
              }
            }
          }, ca().createElement("span", null), ca().createElement("span", {
            className: g.dn
          }), ca().createElement("div", {
            className: g.operateText
          }, (0, ia.vs)("examDetail_clean_up"))), ca().createElement("div", {
            className: `${g.operateBtn} ${h || e.length === 0 || !e[0].right ? "" : g.canUse}`,
            onClick: function () {
              if (!h) {
                if (e.length !== 0 && e[0].rightSectionId) {
                  l.cancel();
                }
              }
            }
          }, ca().createElement("span", {
            className: g.dn
          }), ca().createElement("span", null), ca().createElement("div", {
            className: g.operateText
          }, (0, ia.vs)("examDetail_revoke")))), ca().createElement("div", {
            className: g.lineTips
          }, (0, ia.vs)("examDetail_lineTips")), ca().createElement("div", {
            className: g.lineContent
          }, ca().createElement("div", {
            className: `${g.lineLeft} lineTop`
          }, c.map(function (b, a) {
            return ca().createElement("div", {
              key: b.sectionId,
              className: `${g.lineOption}
                    ${b.status ? g[b.status] : ""}
                    ${h ? g.opacity : ""} lOption`,
              onClick: function () {
                if (!h) {
                  l.handle(b, a, "left");
                }
              }
            }, b.sectionText);
          })), ca().createElement("div", {
            className: g.lineCanvas
          }, ca().createElement("canvas", {
            id: "drawing",
            width: "160"
          })), ca().createElement("div", {
            className: g.lineRight
          }, d.map(function (b, a) {
            return ca().createElement("div", {
              key: b.sectionId,
              className: `${g.lineOption}
                    ${b.status === "connect" ? g.connect : ""}
                    ${h ? g.opacity : ""} rOption`,
              onClick: function () {
                if (!h) {
                  l.handle(b, a, "right");
                }
              }
            }, b.sectionText);
          }))), j === 1 && ca().createElement("div", {
            className: g.h188
          }), a && ca().createElement(pa.Z, {
            onOk: function () {
              l.setState({
                visible: false
              });
              i(false);
              l.setAnswer();
              setTimeout(function () {
                if (!l.props.disabled) {
                  l.operateStatus("clear");
                }
              }, 0);
            },
            onCancel: function () {
              l.setState({
                visible: false
              });
              i(false);
              l.setAnswer();
            },
            okText: (0, ia.vs)("confirm"),
            visible: a,
            confirmAndCancel: true,
            content: ca().createElement("div", {
              className: this.props.classes.clearTip
            }, (0, ia.vs)("examDetail_clearTip"))
          }));
        }
      }]);
      return b;
    }(ba.Component);
    var Ma = (0, da.Z)(function (b) {
      return (0, c.Z)({
        lineOptions: {
          marginTop: 10,
          width: "100%"
        },
        lineOperate: {
          display: "flex",
          justifyContent: "flex-end"
        },
        operateBtn: {
          width: 68,
          height: 28,
          color: "#999",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          border: "1px solid #CCC",
          justifyContent: "center",
          backgroundColor: "#fff",
          marginLeft: 20,
          "& span:nth-child(1)": {
            width: 16,
            height: 16,
            backgroundImage: `url(${Ha})`,
            backgroundSize: "16px 16px"
          },
          "& span:nth-child(2)": {
            width: 16,
            height: 16,
            backgroundImage: `url(${Ja})`,
            backgroundSize: "16px 16px"
          }
        },
        clearTip: {
          marginBottom: 40,
          fontSize: 22,
          textAlign: "center",
          lineHeight: "30px",
          padding: "0 70px 0 70px !important"
        },
        canUse: {
          "&:hover": {
            color: "#666",
            border: "1px solid #999",
            "& span:nth-child(1)": {
              backgroundImage: `url(${Ia})`
            },
            "& span:nth-child(2)": {
              backgroundImage: `url(${Ka})`
            }
          }
        },
        dn: {
          display: "none"
        },
        operateText: {
          fontSize: 14,
          marginLeft: 4
        },
        lineTips: {
          fontSize: 14,
          color: "#999",
          marginTop: -23,
          marginBottom: 28,
          margin: "-23px 0 28px 0",
          width: "80%"
        },
        lineContent: {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between"
        },
        lineLeft: {
          width: 330
        },
        lineCanvas: {
          width: 160,
          height: "100%"
        },
        lineRight: {
          width: 330
        },
        lineOption: {
          width: 308,
          height: 48,
          lineHeight: "50px",
          paddingLeft: 20,
          marginBottom: 10,
          cursor: "pointer",
          color: "#333",
          fontSize: 14,
          background: "#fff",
          borderRadius: 2,
          border: "1px solid #ccc"
        },
        click: {
          color: "#1890FF",
          border: "1px solid #1890FF"
        },
        connect: {
          color: "#1890FF",
          border: "1px solid #fff",
          background: "#F3F9FF"
        },
        clickConnect: {
          color: "#1890FF",
          border: "1px solid  #1890FF",
          background: "#F3F9FF"
        },
        opacity: {
          opacity: 0.5
        },
        op0: {
          opacity: 0
        },
        h188: {
          height: 188
        }
      });
    })(La);
    var Na = (0, ia.vs)("examDetail_limitTip", {
      limit: 3
    }, 1);
    var Oa = (0, da.Z)(s)(function (r) {
      var b = r.classes;
      var c = r.disabled;
      var e = c !== undefined && c;
      var s = r.onSelectOption;
      var a = r.images;
      var i = a === undefined ? [] : a;
      var j = r.limitSize;
      var k = j === undefined ? 0 : j;
      var l = (0, ba.useState)([]);
      var m = (0, ga.Z)(l, 2);
      var n = m[0];
      var d = m[1];
      var o = (0, ba.useState)(false);
      var g = (0, ga.Z)(o, 2);
      var f = g[0];
      var h = g[1];
      (0, ba.useEffect)(function () {
        var b = i.map(function (a) {
          var b = a;
          var c = a.lastIndexOf("/");
          var d = a.substring(c + 1);
          return {
            filePath: b,
            fileType: za(d),
            fileName: d
          };
        });
        d(b);
      }, []);
      return ca().createElement("div", {
        className: b.attachmentWrap
      }, ca().createElement("div", {
        className: b.attachmentTitle
      }, (0, ia.vs)("examDetail_upload_attachment_tip", {
        size: Math.floor(k / 1024 / 1024)
      })), ca().createElement(_a, {
        label: (0, ia.vs)("upload_attachment"),
        onChange: function (c) {
          var a = c.map(function (b) {
            return b.filePath;
          });
          d(c);
          if (s) {
            s("", undefined, a);
          }
        },
        fileList: n,
        action: "/learn/app/clientapi/exam/new/uploadImage.do",
        limit: 3,
        validate: function (a) {
          var b = ["html", "htm", "msg", "eml"];
          if (a.length + n.length > 3) {
            h(true);
            return false;
          }
          for (var c = 0; c < a.length; c++) {
            var g = a[c];
            if (/,|\uff0c|\u3002|!|\uff01|\?|\\uff1f|:|\uff1a|;|\uff1b|\u3001|<|>|\u300a|\u300b|\(|\)|\uff08|\uff09|\[|\]|\u3010|\u3011|\{|\}|\u201c|\u201d|\u2019|\u2018|\u2014\u2014|%|\$|\uffe5|\u2026\u2026/.test(g.name)) {
              Q.g.$message((0, ia.vs)("examDetail_not_allow_special_symbols"));
              return false;
            }
            if (g.size > k) {
              Q.g.$message((0, ia.vs)("examDetail_limit_size", {
                size: Math.floor(k / 1024 / 1024)
              }));
              return false;
            }
            if (g.size === 0) {
              Q.g.$message((0, ia.vs)("examDetail_not_allow_empty"));
              return false;
            }
            var i = za(g.name);
            if (b.indexOf(i) > -1) {
              Q.g.$message((0, ia.vs)("not_support_upload"));
              return false;
            }
          }
          return true;
        },
        disabled: e
      }), ca().createElement(pa.Z, {
        showClose: false,
        onOk: function () {
          h(false);
        },
        visible: f,
        content: Na,
        confirmAndCancel: false,
        okText: (0, ia.vs)("i_got_it")
      }));
    });
    function Pa(b) {
      return (0, c.Z)({
        root: {
          width: "100%"
        },
        question: {
          fontSize: 16,
          color: "#333"
        },
        myAnswerWrap: {
          fontSize: 14,
          margin: "10px 0 30px"
        },
        myAnswerText: {
          color: "#F5212D",
          marginRight: 20
        },
        correctAnswerText: {
          color: "#52C41A"
        }
      });
    }
    var Qa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var Ra = (0, da.Z)(Pa)(function (z) {
      var A = z.classes;
      var c = z.sectionRespList;
      var i = z.onSelectOption;
      var e = z.answerList;
      var j = e === undefined ? [] : e;
      var k = z.isViewErrorQuestions;
      var l = z.isOpenRead;
      var o = z.isFromResult;
      var m = z.setActiveVoiceId;
      var d = z.disabled;
      var p = z.isOpenAnswer;
      var a = z.currentSubject;
      var g = z.showAnswerStatus;
      var q = g !== undefined && g;
      var f = (0, ba.useState)("");
      var h = (0, ga.Z)(f, 2);
      var n = h[0];
      var t = h[1];
      var r = (0, ba.useState)(false);
      var b = (0, ga.Z)(r, 2);
      var s = b[0];
      var u = b[1];
      var v = a.myAnswerList;
      var w = v === undefined ? [] : v;
      return ca().createElement(ca().Fragment, null, ca().createElement("div", {
        style: {
          marginBottom: 8
        }
      }, (0, ia.vs)("answer_questions")), c.map(function (r, v) {
        var a = !(r.questionType === ea.ce.QUESTION_ANSWER) && k && q;
        var b = [];
        var c = (r.sectionRespList || []).map(function (d, a) {
          if (k && w.length && w[v] && (w[v] || {}).answerList.find(function (a) {
            return a === d.sectionId;
          })) {
            if (w[v].answerList.length > 1) {
              b.push(Qa[a]);
            } else {
              b = [Qa[a]];
            }
          }
          return (0, aa.Z)((0, aa.Z)({}, d), {}, {
            optionNo: Qa[a]
          });
        });
        var g = r.sectionRespList.reduce(function (d, a, b) {
          if (a.isCorrect === "Y" && q) {
            return d.concat(Qa[b]);
          } else {
            return d;
          }
        }, []);
        var f = (0, aa.Z)((0, aa.Z)({}, r), {}, {
          currentSubject: {
            image: r.image || "",
            fileUrl: r.fileUrl || "",
            questionText: r.questionText,
            answerTip: r.answerTip,
            myAnswer: w.length ? w[v].answerList : [],
            questionType: r.questionType
          },
          onSelectOption: i,
          answerList: j[v] || [],
          currentIndex: r.sortNo - 1,
          isViewErrorQuestions: k,
          sectionRespList: c,
          isOpenRead: l,
          setActiveVoiceId: m,
          disabled: d,
          showAnswerStatus: q
        });
        return ca().createElement(ca().Fragment, null, ca().createElement("div", {
          className: A.question
        }, !k && Boolean(l) && ca().createElement(ca().Fragment, null, ca().createElement(V, {
          voiceUrl: r.voiceUrl || "",
          id: `voice_${r.questionId}`,
          className: "questionVoice",
          showText: true,
          setActiveVoiceId: m
        }), ca().createElement("div", {
          style: {
            height: 10
          }
        })), ca().createElement(M, (0, X.Z)({}, f, {
          isMainTopic: false,
          key: r.questionId,
          changeViewAnswerTipsState: function (a) {
            t(r.questionId || "");
            u(a);
          },
          isOpenAnswer: p,
          viewAnswerTips: n === r.questionId && s,
          setActiveVoiceId: m
        })), a && ca().createElement("div", {
          className: A.myAnswerWrap
        }, o && r.questionType !== ea.ce.FILL_IN_BLANK ? ca().createElement("span", {
          className: A.myAnswerText
        }, (0, ia.vs)("my_answers"), " ", b.length > 0 ? b.join("、") : (0, ia.vs)("examDetail_no_answer")) : null, ca().createElement("span", {
          className: A.correctAnswerText
        }, (0, ia.vs)("correct_answer"), " ", g.join("、")))), function (d) {
          var a = d.questionType;
          var b = d.questionId;
          switch (a) {
            case ea.ce.SINGLE:
            case ea.ce.JUDGE:
              return ca().createElement(ka, (0, X.Z)({}, d, {
                key: b
              }));
            case ea.ce.MULTIPLE:
              return ca().createElement(W, (0, X.Z)({}, d, {
                key: b
              }));
            default:
              return ca().createElement(ca().Fragment, null);
          }
        }(f));
      }));
    });
    var Sa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var Ta = (0, da.Z)(Pa)(function (z) {
      var A = z.classes;
      var c = z.sectionRespList;
      var i = z.onSelectOption;
      var e = z.answerList;
      var j = e === undefined ? [] : e;
      var k = z.isViewErrorQuestions;
      var l = z.isOpenRead;
      var o = z.isFromResult;
      var m = z.setActiveVoiceId;
      var d = z.disabled;
      var p = z.isOpenAnswer;
      var a = z.currentSubject;
      var g = z.showAnswerStatus;
      var f = g !== undefined && g;
      var q = (0, ba.useState)("");
      var h = (0, ga.Z)(q, 2);
      var u = h[0];
      var n = h[1];
      var r = (0, ba.useState)(false);
      var b = (0, ga.Z)(r, 2);
      var t = b[0];
      var s = b[1];
      var v = a.myAnswerList;
      var w = v === undefined ? [] : v;
      return ca().createElement(ca().Fragment, null, ca().createElement("div", {
        style: {
          marginBottom: 8
        }
      }, (0, ia.vs)("answer_questions")), c.map(function (q, r) {
        var a;
        var b = !(q.questionType === ea.ce.QUESTION_ANSWER) && k && f;
        var e = [];
        var v = (q.sectionRespList || []).map(function (d, a) {
          if (k && w.length && w[r] && (w[r] || {}).answerList.find(function (a) {
            return a === d.sectionId;
          })) {
            if (w[r].answerList.length > 1) {
              e.push(Sa[a]);
            } else {
              e = [Sa[a]];
            }
          }
          return (0, aa.Z)((0, aa.Z)({}, d), {}, {
            optionNo: Sa[a]
          });
        });
        var x = (a = q.sectionRespList) === null || a === undefined ? undefined : a.reduce(function (d, a, b) {
          if (a.isCorrect === "Y" && f) {
            return d.concat(Sa[b]);
          } else {
            return d;
          }
        }, []);
        var h = (0, aa.Z)((0, aa.Z)({}, q), {}, {
          currentSubject: {
            image: q.image || "",
            fileUrl: q.fileUrl || "",
            questionText: q.questionText,
            answerTip: q.answerTip,
            myAnswer: w.length ? w[r].answerList : [],
            questionType: q.questionType
          },
          onSelectOption: i,
          answerList: j[r] || [],
          currentIndex: q.sortNo - 1,
          isViewErrorQuestions: k,
          sectionRespList: v,
          isOpenRead: l,
          setActiveVoiceId: m,
          disabled: d,
          showAnswerStatus: f
        });
        return ca().createElement(ca().Fragment, null, ca().createElement("div", {
          className: A.question
        }, !k && Boolean(l) && ca().createElement(ca().Fragment, null, ca().createElement(V, {
          voiceUrl: q.voiceUrl || "",
          id: `voice_${q.questionId}`,
          className: "questionVoice",
          showText: true,
          setActiveVoiceId: m
        }), ca().createElement("div", {
          style: {
            height: 10
          }
        })), ca().createElement(M, (0, X.Z)({}, h, {
          isMainTopic: false,
          key: q.questionId,
          changeViewAnswerTipsState: function (a) {
            n(q.questionId || "");
            s(a);
          },
          isOpenAnswer: p,
          viewAnswerTips: u === q.questionId && t,
          setActiveVoiceId: m
        })), b && ca().createElement("div", {
          className: A.myAnswerWrap
        }, o && q.questionType !== ea.ce.FILL_IN_BLANK ? ca().createElement("span", {
          className: A.myAnswerText
        }, (0, ia.vs)("my_answers"), " ", e.length > 0 ? e.join("、") : (0, ia.vs)("examDetail_no_answer")) : null, ca().createElement("span", {
          className: A.correctAnswerText
        }, (0, ia.vs)("correct_answer"), " ", x.join("、")))), function (d) {
          var a = d.questionType;
          var b = d.questionId;
          switch (a) {
            case ea.ce.SINGLE:
            case ea.ce.JUDGE:
              return ca().createElement(ka, (0, X.Z)({}, d, {
                key: b
              }));
            case ea.ce.MULTIPLE:
              return ca().createElement(W, (0, X.Z)({}, d, {
                key: b
              }));
            default:
              return ca().createElement(ca().Fragment, null);
          }
        }(h));
      }));
    });
    var Ua = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var Va = (0, da.Z)(Pa)(function (A) {
      var B = A.classes;
      var c = A.sectionRespList;
      var i = A.onSelectOption;
      var e = A.answerList;
      var j = e === undefined ? [] : e;
      var k = A.isViewErrorQuestions;
      var l = A.isOpenRead;
      var o = A.isFromResult;
      var m = A.setActiveVoiceId;
      var d = A.disabled;
      var p = A.isOpenAnswer;
      var a = A.currentSubject;
      var g = A.showAnswerStatus;
      var f = g !== undefined && g;
      var q = (0, ba.useState)("");
      var h = (0, ga.Z)(q, 2);
      var u = h[0];
      var n = h[1];
      var r = (0, ba.useState)(false);
      var b = (0, ga.Z)(r, 2);
      var v = b[0];
      var s = b[1];
      var w = a.myAnswerList;
      var t = w === undefined ? [] : w;
      function x(e) {
        var a = e.questionType;
        var b = e.questionId;
        switch (a) {
          case ea.ce.QUESTION_ANSWER:
            return ca().createElement(Ea, (0, X.Z)({}, e, {
              key: b
            }));
          case ea.ce.READ:
            return ca().createElement(ca().Fragment, null, e.newQuestionNodes.map(function (a, b) {
              return function (e, a) {
                var b = (0, aa.Z)((0, aa.Z)({}, e), {}, {
                  currentSubject: {
                    image: e.image || "",
                    fileUrl: e.fileUrl || "",
                    questionText: e.questionText,
                    answerTip: e.answerTip,
                    questionType: e.questionType,
                    questionId: e.questionId
                  },
                  onSelectOption: i,
                  answerList: e.answers[a] ? e.answers[a].answerList : [],
                  currentIndex: e.sortNo - 1,
                  isViewErrorQuestions: k,
                  sectionRespList: [],
                  isOpenRead: l,
                  setActiveVoiceId: m,
                  disabled: d
                });
                return ca().createElement(ca().Fragment, null, ca().createElement(M, (0, X.Z)({}, b, {
                  isMainTopic: false,
                  key: e.questionId,
                  changeViewAnswerTipsState: function (a) {
                    n(e.questionId || "");
                    s(a);
                  },
                  isOpenAnswer: p,
                  viewAnswerTips: u === e.questionId && v,
                  setActiveVoiceId: m
                })), ca().createElement(Ea, (0, X.Z)({}, b, {
                  key: e.questionId
                })));
              }((0, aa.Z)((0, aa.Z)({}, a), {}, {
                answers: e.currentSubject.myAnswer.questionNodesAnswer || []
              }), b);
            }));
          default:
            return ca().createElement(ca().Fragment, null);
        }
      }
      return ca().createElement(ca().Fragment, null, ca().createElement("div", {
        style: {
          marginBottom: 8
        }
      }, (0, ia.vs)("answer_questions")), c.map(function (q, r) {
        var a;
        var b = !(q.questionType === ea.ce.QUESTION_ANSWER) && k && f;
        var e = [];
        var w = (q.sectionRespList || []).map(function (d, a) {
          if (k && t.length && t[r] && (t[r] || {}).answerList.find(function (a) {
            return a === d.sectionId;
          })) {
            if (t[r].answerList.length > 1) {
              e.push(Ua[a]);
            } else {
              e = [Ua[a]];
            }
          }
          return (0, aa.Z)((0, aa.Z)({}, d), {}, {
            optionNo: Ua[a]
          });
        });
        var y = (a = q.sectionRespList) === null || a === undefined ? undefined : a.reduce(function (d, a, b) {
          if (a.isCorrect === "Y" && f) {
            return d.concat(Ua[b]);
          } else {
            return d;
          }
        }, []);
        var h = (0, aa.Z)((0, aa.Z)({}, q), {}, {
          currentSubject: {
            image: q.image || "",
            fileUrl: q.fileUrl || "",
            questionText: q.questionText,
            answerTip: q.answerTip,
            myAnswer: j.length ? j[r] : [],
            questionType: q.questionType,
            questionId: q.questionId
          },
          onSelectOption: i,
          answerList: j[r] || [],
          currentIndex: q.sortNo - 1,
          isViewErrorQuestions: k,
          sectionRespList: w,
          isOpenRead: l,
          setActiveVoiceId: m,
          disabled: d
        });
        return ca().createElement(ca().Fragment, null, ca().createElement("div", {
          className: B.question
        }, !k && Boolean(l) && ca().createElement(ca().Fragment, null, ca().createElement(V, {
          voiceUrl: q.voiceUrl || "",
          id: `voice_${q.questionId}`,
          className: "questionVoice",
          showText: true,
          setActiveVoiceId: m
        }), ca().createElement("div", {
          style: {
            height: 10
          }
        })), ca().createElement(M, (0, X.Z)({}, h, {
          isMainTopic: false,
          key: q.questionId,
          changeViewAnswerTipsState: function (a) {
            n(q.questionId || "");
            s(a);
          },
          isOpenAnswer: p,
          viewAnswerTips: u === q.questionId && v,
          setActiveVoiceId: m
        })), b && ca().createElement("div", {
          className: B.myAnswerWrap
        }, o && q.questionType !== ea.ce.FILL_IN_BLANK ? ca().createElement("span", {
          className: B.myAnswerText
        }, (0, ia.vs)("my_answers"), " ", e.length > 0 ? e.join("、") : (0, ia.vs)("examDetail_no_answer")) : null, ca().createElement("span", {
          className: B.correctAnswerText
        }, (0, ia.vs)("correct_answer"), " ", y.join("、")))), x(h));
      }));
    });
    var Wa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    function Xa(b) {}
    var Ya = (0, da.Z)(s)(function (P) {
      var c = P.classes;
      var e = P.currentIndex;
      var i = P.currentSubject;
      var n = P.answerList;
      var a = P.onSelectOption;
      var o = P.isViewErrorQuestions;
      var l = o !== undefined && o;
      var r = P.isFromResult;
      var m = P.detail;
      var d = P.viewAnswerTipsState;
      var p = P.changeViewAnswerTipsState;
      var s = P.images;
      var g = s === undefined ? [] : s;
      var f = P.disabled;
      var h = f !== undefined && f;
      var t = P.setOperateVisible;
      var u = t === undefined ? Xa : t;
      var v = P.currentLength;
      var w = v === undefined ? 0 : v;
      var b = P.limitSize;
      var x = b === undefined ? 0 : b;
      var k = d !== undefined && d;
      var z = i.sectionRespList;
      var y = i.myAnswer;
      var A = y === undefined ? [] : y;
      var C = i.questionType;
      var E = C === undefined ? "" : C;
      var B = i.questionId;
      var I = i.voiceUrl;
      var D = i.newQuestionNodes;
      var L = D === undefined ? [] : D;
      var Y = m.isOpenAnswer;
      var N = m.isPhotoAnswer;
      var F = m.isOpenRead;
      var Q = m.isShowAnswer;
      var O = E === "C" || E === "R" || E === "SG";
      var R = O ? 0 : Y;
      var S = [];
      var G = [];
      var T = (z || []).map(function (c, a) {
        if (l) {
          if (E === ea.ce.FILL_IN_BLANK) {
            if (c && c.sectionText) {
              G.push(c.sectionText);
            }
          } else {
            if (A.find(function (a) {
              return a === c.sectionId;
            })) {
              S.push(Wa[a]);
            }
            if (c.isCorrect === "Y") {
              G.push(Wa[a]);
            }
          }
        }
        return (0, aa.Z)((0, aa.Z)({}, c), {}, {
          optionNo: Wa[a]
        });
      });
      function J(g) {
        var b;
        var h = Array.from(document.getElementsByTagName("audio"));
        var d = Array.from(new Set(h));
        var e = (0, q.Z)(d.filter(function (b) {
          return b.id.includes("voice_");
        }));
        try {
          for (e.s(); !(b = e.n()).done;) {
            var a = b.value;
            a.pause();
            a.currentTime = 0;
          }
        } catch (a) {
          e.e(a);
        } finally {
          e.f();
        }
        d.find(function (b) {
          return b.id === g;
        }).play();
      }
      var K = $a.Z.examStage === ea.Bc.errorQuestions && Q === 1;
      var H = {
        currentSubject: i,
        onSelectOption: a,
        answerList: n,
        currentIndex: e,
        sectionRespList: O ? L : T,
        isViewErrorQuestions: l,
        isFromResult: r,
        isOpenRead: F,
        setActiveVoiceId: J,
        disabled: h,
        showAnswerStatus: K
      };
      var U = !(E === ea.ce.QUESTION_ANSWER) && l && K;
      return ca().createElement("div", {
        className: c.subject
      }, !l && Boolean(F) && ca().createElement(V, {
        voiceUrl: I || "",
        id: `voice_${B}`,
        className: "questionVoice",
        showText: true,
        setActiveVoiceId: J
      }), ca().createElement("div", {
        className: c.question
      }, ca().createElement(M, (0, X.Z)({}, H, {
        isShowAnswer: Q,
        key: B,
        changeViewAnswerTipsState: p,
        isOpenAnswer: R,
        viewAnswerTips: k,
        setActiveVoiceId: J
      }))), !O && U && ca().createElement("div", {
        className: c.myAnswerWrap
      }, r && E !== ea.ce.FILL_IN_BLANK ? ca().createElement("span", {
        className: c.myAnswerText
      }, (0, ia.vs)("examDetail_my_answers"), " ", S.length > 0 ? S.join("、") : (0, ia.vs)("examDetail_no_answer")) : null, K && ca().createElement("span", {
        className: c.correctAnswerText
      }, (0, ia.vs)("examDetail_correct_answer"), " ", G.map(function (c, a) {
        return ca().createElement("span", {
          style: {
            marginRight: "20px"
          }
        }, `${a + 1}.${c}`);
      }))), function () {
        switch (E) {
          case ea.ce.SINGLE:
          case ea.ce.JUDGE:
            return ca().createElement(ka, (0, X.Z)({}, H, {
              key: B
            }));
          case ea.ce.MULTIPLE:
            return ca().createElement(W, (0, X.Z)({}, H, {
              key: B
            }));
          case ea.ce.QUESTION_ANSWER:
            return ca().createElement(Ea, (0, X.Z)({}, H, {
              key: B,
              isPhotoAnswer: N,
              images: g
            }));
          case ea.ce.IMAGE:
            return ca().createElement(Ga, (0, X.Z)({}, H, {
              key: B
            }));
          case ea.ce.LINE:
            return ca().createElement(Ma, (0, X.Z)({}, H, {
              key: B,
              setOperateVisible: u,
              currentLength: w
            }));
          case ea.ce.ATTACMENT:
            return ca().createElement(Oa, (0, X.Z)({}, H, {
              key: B,
              images: g,
              limitSize: x
            }));
          case ea.ce.CASE_ANALYSIS:
            return ca().createElement(Ra, (0, X.Z)({}, H, {
              key: B,
              images: g,
              isOpenAnswer: Y
            }));
          case ea.ce.GROUP_SINGLE:
            return ca().createElement(Ta, (0, X.Z)({}, H, {
              key: B,
              images: g,
              isOpenAnswer: Y
            }));
          case ea.ce.READ:
            return ca().createElement(Va, (0, X.Z)({}, H, {
              key: B,
              images: g,
              isOpenAnswer: Y
            }));
          default:
            return ca().createElement(ca().Fragment, null);
        }
      }());
    });
  },
  76138: function (q, j, e) {
    "use strict";

    var Aa = e(20042);
    var k = e(84322);
    var t = e.n(k);
    var z = e(33032);
    var i = e(67294);
    var o = e.n(i);
    var a = e(52543);
    var r = e(20849);
    var l = e(37200);
    var c = e(90678);
    var s = e(87027);
    var u = e(35492);
    var p = e(19040);
    var A = e(90728);
    var g = e(95850);
    var f = e(57972);
    var h = e(9549);
    var v = e(69134);
    var E = e(66045);
    var m = e(30381);
    var d = e.n(m);
    var n = e(22380);
    j.Z = (0, a.Z)(c.Z)(function (b) {
      var x = b.classes;
      var c = b.setExamStage;
      var a = b.examResultObj;
      var e = a.status;
      var m = a.score;
      var w = a.pointNum;
      var aa = a.isSubmit;
      var I = b.setIsFromResult;
      var k = b.detail;
      var C = b.getExamBreakInfo;
      var y = b.setRemainTime;
      var N = b.getExamDetail;
      var S = b.changeLoading;
      var T = b.cutScreenInfo;
      var B = k.ishidenerrquestion;
      var R = k.totalScoreStr;
      var D = k.testType;
      var L = k.endTime;
      var q = k.certificateId;
      k.attemptNum;
      var Q = k.remianingNum;
      var F = k.isPassed;
      var U = k.showErrorType;
      var M = k.minScore;
      var O = k.isAgainTest;
      var P = O === undefined ? 1 : O;
      var Z = k.ishasHistoryScore;
      var W = k.publishScoreTime;
      var Y = k.markingStatus;
      var G = k.isExamType;
      var V = k.isSubmitExam;
      var J = k.isPublishScore;
      var K = k.myHighestScore;
      var H = k.hasHistoryScore;
      (0, i.useEffect)(function () {
        X();
        wa();
      }, []);
      var X = function () {
        var b = (0, z.Z)(t().mark(function b() {
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  S(true);
                  b.next = 3;
                  return N(false);
                case 3:
                  S(false);
                case 4:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      var j = (0, i.useState)(false);
      var _ = (0, Aa.Z)(j, 2);
      var ba = _[0];
      var ca = _[1];
      var da = (0, i.useState)(false);
      var ea = (0, Aa.Z)(da, 2);
      var fa = ea[0];
      var ga = ea[1];
      var ha = (0, i.useState)(false);
      var ia = (0, Aa.Z)(ha, 2);
      var ja = ia[0];
      var ka = ia[1];
      var la = (0, i.useState)(false);
      var ma = (0, Aa.Z)(la, 2);
      var na = ma[0];
      var oa = ma[1];
      Number(M);
      var pa = (0, n.y)({
        isExamType: G,
        isSubmitExam: V,
        isPublishScore: J,
        publishScoreTime: W,
        ishasHistoryScore: Z,
        isSubmit: aa,
        markingStatus: Y,
        testType: D,
        hasHistoryScore: H
      }) || 99;
      var qa = Number(K) >= Number(M) ? l.E.PASS : l.E.NO_PASS;
      var ra = e || qa;
      var sa = !W || new Date(W) < new Date();
      var ta = J !== 0 && sa;
      ta = G ? Y === 2 && ta : ta;
      var Ba = function () {
        var b = (0, z.Z)(t().mark(function b() {
          return t().wrap(function (b) {
            for (;;) {
              switch (b.prev = b.next) {
                case 0:
                  c(l.Bc.transition);
                  b.next = 3;
                  return C(false);
                case 3:
                case "end":
                  return b.stop();
              }
            }
          }, b);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      var va = function () {
        var b = (0, z.Z)(t().mark(function a() {
          var b;
          var e;
          var h;
          var i;
          return t().wrap(function (c) {
            for (;;) {
              switch (c.prev = c.next) {
                case 0:
                  b = window.outerWidth + 10 >= screen.availWidth && window.outerHeight + 10 >= screen.availHeight;
                  if (!T || T.remainderTimes !== 0) {
                    c.next = 4;
                    break;
                  }
                  ka(true);
                  return c.abrupt("return");
                case 4:
                  e = window.navigator.userAgent.toLocaleLowerCase();
                  h = e.indexOf("wxwork") > -1;
                  i = Number(e.split("chrome/")[1].split(".")[0]);
                  if (e.includes("mac") && e.includes("chrome") && i > 110) {
                    b = true;
                  }
                  if (h) {
                    b = true;
                  }
                  if (b || k.isFlipScreen !== l.iK.Open) {
                    c.next = 12;
                    break;
                  }
                  oa(true);
                  return c.abrupt("return");
                case 12:
                  ca(true);
                  c.next = 15;
                  return C(true);
                case 15:
                  y({
                    recognitionStatus: null,
                    remainSeconds: null
                  });
                  ca(false);
                case 17:
                case "end":
                  return c.stop();
              }
            }
          }, a);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      var wa = function () {
        var b = (0, z.Z)(t().mark(function a() {
          var b;
          var h;
          var i;
          var j;
          var k;
          return t().wrap(function (c) {
            for (;;) {
              switch (c.prev = c.next) {
                case 0:
                  b = false;
                  h = Y === l.hp.MARK_ING;
                  i = !Y || !ra || !m || (m && parseFloat(m)) === parseFloat(R);
                  if (D !== l.kq.MOCK) {
                    c.next = 7;
                    break;
                  }
                  b = !i && !h;
                  c.next = 12;
                  break;
                case 7:
                  c.next = 9;
                  return r.Gn.getTimestamp();
                case 9:
                  if ((j = c.sent)._failure) {
                    b = false;
                  }
                  if (j.body.timestamp && +j.code === 0) {
                    k = parseInt(j.body.timestamp, 10);
                    b = !(i || !B || B === "Y" || U === 2 && L > k || U === 2 && L === k);
                  }
                case 12:
                  ga(b);
                case 13:
                case "end":
                  return c.stop();
              }
            }
          }, a);
        }));
        return function () {
          return b.apply(this, arguments);
        };
      }();
      function xa() {
        var b = false;
        b = !(D !== l.kq.FORMAL || !q || F !== l.hn.YES);
        return !!ta && b;
      }
      function ya(b) {
        if (D !== l.kq.FORMAL || Q !== 0 && Q) {
          return o().createElement(s.Z, {
            loading: ba,
            className: `${x.button} ${b ? x.buttonLeft : ""}`,
            onClick: va
          }, (0, v.vs)("examDetail_test_again"));
        } else {
          return o().createElement("div", {
            className: `${x.button} ${x.examEndedButton} ${b ? x.endButtonLeft : ""}`
          }, (0, v.vs)("examDetail_test_again"));
        }
      }
      return o().createElement("div", {
        className: x.resultBox
      }, o().createElement("h5", {
        className: x.resultTitle
      }, function () {
        var b = zn_t_intelligent_portal("3d447201", "请等待成绩公布");
        if ([13, 23, 21].includes(pa)) {
          if (ra === l.E.PASS) {
            b = zn_t_intelligent_portal("d4f793ed", "恭喜你！考试通过啦");
          } else if (ra !== l.E.PASS) {
            b = zn_t_intelligent_portal("cc084e86", "很遗憾，这次没有通过，再接再厉吧");
          }
        } else if ([12, 22, 20].includes(pa)) {
          b = zn_t_intelligent_portal("25aad58b", "交卷成功，老师正在阅卷中");
        }
        return b;
      }()), [13, 23, 21].includes(pa) && o().createElement("div", {
        className: x.resultMes
      }, o().createElement("div", {
        className: `${x.resultMesNum} ${ra === l.E.PASS ? x.resultMesNumPass : x.resultMesNumNo}`
      }, m || K || 0, o().createElement("span", {
        className: x.resultMesNumName
      }, (0, v.vs)("score"))), o().createElement("span", {
        className: x.resultMesName
      }, (0, v.vs)("exam_score"))), ![13, 23, 21].includes(pa) && o().createElement("div", {
        className: x.resultMesIng
      }, function () {
        var b = "";
        if ([12, 22, 20].includes(pa)) {
          b = zn_t_intelligent_portal("7938ae3a", "阅卷完成后，再次进入考试即可查看成绩");
        } else if (pa === 32 || pa === 35 || pa === 43) {
          b = zn_t_intelligent_portal("02de2188", `请等待至${d()(W).format("YYYY-MM-DD HH:mm")}公布考试成绩后，到“我的考试”查阅考试成绩`, {
            var_0: d()(W).format("YYYY-MM-DD HH:mm")
          });
        } else if (pa === 31 || pa === 34 || pa === 42) {
          b = zn_t_intelligent_portal("07348afe", `请在阅卷完成后，并等待至${d()(W).format("YYYY-MM-DD HH:mm")}公布成绩后，到“我的考试”查阅考试成绩`, {
            var_0: d()(W).format("YYYY-MM-DD HH:mm")
          });
        } else if (pa === 63 || pa === 52 || pa === 55) {
          b = zn_t_intelligent_portal("46bd4f18", "请等待管理员公布成绩后，到“我的考试”查阅考试成绩");
        } else if (!(pa !== 62 && pa !== 51 && pa !== 54)) {
          b = zn_t_intelligent_portal("55ada86c", "请在阅卷完成后，并等待管理员公布成绩后，到“我的考试”查阅考试成绩");
        }
        return b;
      }()), D === l.kq.FORMAL && Boolean(F) && w && o().createElement("div", {
        className: x.pointNum
      }, zn_t_intelligent_portal("084a2336", `恭喜获得${w}积分~`, {
        var_0: w
      })), ![13, 23, 21].includes(pa) && o().createElement("img", {
        src: A,
        alt: "",
        className: x.resultImg
      }), [13, 23, 21].includes(pa) && ra === l.E.PASS && o().createElement("img", {
        src: u,
        alt: "",
        className: x.resultImg
      }), [13, 23, 21].includes(pa) && ra === l.E.NO_PASS && o().createElement("img", {
        src: p,
        alt: "",
        className: x.resultImg
      }), (![13, 23, 21].includes(pa) || [13, 23, 21].includes(pa) && (ra === l.E.NO_PASS || ra === l.E.MARKED)) && o().createElement("div", {
        className: x.buttons
      }, o().createElement(s.Z, {
        loading: false,
        className: `${x.button} ${x.buttonLeft}`,
        onClick: Ba
      }, (0, v.vs)("back")), ya()), [13, 23, 21].includes(pa) && ra === l.E.PASS && o().createElement("div", {
        className: x.buttons
      }, P ? ya(true) : null, o().createElement(s.Z, {
        loading: false,
        className: `${x.button}`,
        onClick: Ba
      }, (0, v.vs)("back"))), o().createElement("ul", {
        className: x.seeUrl
      }, fa && o().createElement("li", {
        className: `${x.seeUrlDetail} ${xa() ? x.seeUrlLeft : ""}`,
        onClick: function () {
          I(true);
          c(l.Bc.errorQuestions);
        }
      }, o().createElement("img", {
        src: g,
        alt: "",
        className: x.seeUrlImg
      }), o().createElement("span", null, (0, v.vs)("examDetail_check_wrong"))), xa() && o().createElement("li", {
        className: x.seeUrlDetail,
        onClick: function () {
          I(true);
          c(l.Bc.checkCertificate);
        }
      }, o().createElement("img", {
        src: f,
        alt: "",
        className: x.seeUrlImg
      }), o().createElement("span", null, (0, v.vs)("examDetail_check_certificate"))), ta && o().createElement("li", {
        className: `${x.seeUrlDetail} ${xa() || fa ? x.mgl50 : ""}`,
        onClick: function () {
          window.location.href = `#/home/examScoreRank/${b.examId}`;
        }
      }, o().createElement("img", {
        src: h,
        alt: "",
        className: x.seeUrlImg
      }), o().createElement("span", null, zn_t_intelligent_portal("8f0cdc6d", "查看成绩排行榜")))), o().createElement(E.Z, {
        visible: ja,
        onOk: function () {
          return ka(false);
        },
        okText: (0, v.vs)("i_got_it")
      }, o().createElement("div", null, (0, v.vs)("administrator_to_unblock"))), o().createElement(E.Z, {
        visible: na,
        onOk: function () {
          return oa(false);
        },
        okText: (0, v.vs)("i_got_it")
      }, o().createElement("div", {
        className: x.warningText
      }, (0, v.vs)("warning")), o().createElement("div", null, (0, v.vs)("keep_screen_max"))));
    });
  },
  67001: function (t, b, e) {
    "use strict";

    e.d(b, {
      Z: function () {
        return f;
      }
    });
    var j = e(84322);
    var k = e.n(j);
    var a = e(33032);
    var i = e(20042);
    var q = e(67294);
    var o = e.n(q);
    var r = e(52543);
    var c = e(30381);
    var l = e.n(c);
    var n = e(87623);
    var z = e(37200);
    var m = e(20849);
    var d = e(40053);
    var p = e(67246);
    var g = e(69134);
    var f = (0, r.Z)(function (b) {
      return (0, n.Z)({
        historyBox: {
          minHeight: 520,
          position: "relative",
          padding: "40px 0"
        },
        historyIcons: {
          position: "absolute",
          right: 60,
          top: 0
        },
        historyIcon: {
          width: 78,
          height: 52
        },
        historyTitle: {
          maxWidth: 600,
          fontSize: 24,
          color: "#333333",
          textAlign: "center",
          margin: "0 auto 20px"
        },
        historyMes: {
          height: 20,
          lineHeight: "20px",
          fontSize: 14,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 0 30px"
        },
        historyMesLeft: {
          display: "inline-block",
          color: "#999999"
        },
        historyMesRight: {
          display: "inline-block",
          color: "#151515",
          marginLeft: 0,
          fontWeight: "bold"
        },
        historyMesTwo: {
          marginLeft: 50
        },
        historyMesBox: {
          display: "flex"
        },
        historyTable: {
          width: 1060,
          margin: "0 auto",
          fontSize: 14,
          color: "#333333"
        },
        historyThead: {
          background: "#F5F5F5",
          height: 50,
          display: "flex",
          alignItems: "center",
          fontWeight: "bold"
        },
        historyList: {
          height: 270,
          overflow: "auto"
        },
        historyTbody: {
          height: 59,
          borderBottom: "1px solid #F5F5F5",
          display: "flex",
          alignItems: "center"
        },
        tdOne: {
          width: "33%",
          textAlign: "center"
        },
        tdTwo: {
          width: "34%",
          textAlign: "center"
        },
        tdThree: {
          width: "33%",
          textAlign: "center"
        },
        ing: {
          color: "#FAAD15"
        },
        pass: {
          color: "#52C41A"
        },
        noPass: {
          color: "#FA534A"
        },
        goback: {
          fontSize: "14px",
          cursor: "pointer",
          position: "absolute",
          top: "26px",
          paddingLeft: "50px",
          width: "50px"
        },
        noMakeExam: {
          color: "#FA534A"
        },
        isMakeExam: {
          color: "#999999"
        }
      });
    })(function (f) {
      var c = f.classes;
      var h = f.examId;
      var j = f.detail;
      var e = j.testName;
      var n = j.totalScoreStr;
      var r = j.minScoreStr;
      var s = f.setExamStage;
      var t = f.getExamBreakInfo;
      var u = (0, q.useState)([]);
      var v = (0, i.Z)(u, 2);
      var x = v[0];
      var w = v[1];
      (0, q.useEffect)(function () {
        y();
      }, []);
      var y = function () {
        var c = (0, a.Z)(k().mark(function a() {
          var b;
          return k().wrap(function (c) {
            for (;;) {
              switch (c.prev = c.next) {
                case 0:
                  c.next = 2;
                  return m.Oe.queryNewHistoryScore(h);
                case 2:
                  if (!(b = c.sent)._failure) {
                    c.next = 5;
                    break;
                  }
                  return c.abrupt("return");
                case 5:
                  if (b.body && b.code === 0) {
                    w(b.body);
                  }
                case 6:
                case "end":
                  return c.stop();
              }
            }
          }, a);
        }));
        return function () {
          return c.apply(this, arguments);
        };
      }();
      return o().createElement("div", {
        className: c.historyBox
      }, o().createElement("div", {
        className: c.goback,
        onClick: function () {
          s(z.Bc.info);
          t();
        }
      }, "< ", (0, g.vs)("back")), x.length > 0 && o().createElement(o().Fragment, null, o().createElement("div", {
        className: c.historyIcons
      }, x[0].examType === z.kq.FORMAL ? o().createElement("img", {
        src: d,
        alt: "",
        className: c.historyIcon
      }) : o().createElement("img", {
        src: p,
        alt: "",
        className: c.historyIcon
      })), o().createElement("h5", {
        className: c.historyTitle
      }, e), o().createElement("div", {
        className: c.historyMes
      }, o().createElement("dl", {
        className: c.historyMesBox
      }, o().createElement("dt", {
        className: c.historyMesLeft
      }, (0, g.vs)("examDetail_total")), o().createElement("dd", {
        className: c.historyMesRight
      }, (0, g.vs)("totalScoreStr", {
        totalScoreStr: n
      }))), o().createElement("dl", {
        className: `${c.historyMesBox} ${c.historyMesTwo}`
      }, o().createElement("dt", {
        className: c.historyMesLeft
      }, (0, g.vs)("examDetail_pass_score")), o().createElement("dd", {
        className: c.historyMesRight
      }, (0, g.vs)("totalScoreStr", {
        totalScoreStr: r
      }))))), o().createElement("div", {
        className: c.historyTable
      }, o().createElement("ul", {
        className: c.historyThead
      }, o().createElement("li", {
        className: c.tdOne
      }, (0, g.vs)("examDetail_exam_time")), o().createElement("li", {
        className: c.tdTwo
      }, (0, g.vs)("examDetail_score")), o().createElement("li", {
        className: c.tdThree
      }, (0, g.vs)("examDetail_pass_or_not")), o().createElement("li", {
        className: c.tdThree
      }, zn_t_intelligent_portal("d4cf050c", "是否补考"))), o().createElement("div", {
        className: c.historyList
      }, x.map(function (b) {
        return o().createElement("ul", {
          className: c.historyTbody,
          key: b.attemptId
        }, o().createElement("li", {
          className: c.tdOne
        }, l()(Number(b.completeDate)).format("YYYY-MM-DD HH:mm")), o().createElement("li", {
          className: c.tdTwo
        }, b.markingStatus === z.hp.MARK_ING || b.score === null || b.score === undefined ? (0, g.vs)("examDetail_not_yet") : b.score), o().createElement("li", {
          className: c.tdThree
        }, b.markingStatus === z.hp.MARK_ING && o().createElement("span", {
          className: c.ing
        }, (0, g.vs)("examDetail_in_marking")), b.markingStatus === z.hp.MARK_END && b.isPass === z.E.PASS && o().createElement("span", {
          className: c.pass
        }, (0, g.vs)("examDetail_passed")), b.markingStatus === z.hp.MARK_END && b.isPass === z.E.NO_PASS && o().createElement("span", {
          className: c.noPass
        }, (0, g.vs)("examDetail_failed"))), o().createElement("li", {
          className: b.isMakeExam ? c.isMakeExam : c.noMakeExam
        }, b.isMakeExam === 1 ? o().createElement("span", null, zn_t_intelligent_portal("631b9e9e", "补考")) : o().createElement("span", null, "-")));
      }))));
    });
  },
  91914: function (a, b, c) {
    "use strict";

    var d = c(87623);
    b.Z = function (b) {
      return (0, d.Z)({
        top: {
          position: "relative",
          padding: "30px 100px 40px 100px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        },
        timeProgress: {
          position: "absolute",
          left: 0,
          top: 0,
          height: 2,
          background: "#1890FF"
        },
        topLeft: {
          display: "flex",
          alignItems: "flex-end"
        },
        subjectNum: {
          display: "flex",
          alignItems: "baseline",
          height: 35
        },
        currentSubject: {
          fontSize: 34,
          color: b.palette.primary.main,
          fontWeight: "bold",
          fontStyle: "italic",
          marginRight: 5
        },
        totalSubject: {
          fontSize: 16,
          color: "#666"
        },
        subjectType: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 5px",
          height: 22,
          marginLeft: 9,
          borderRadius: 2,
          backgroundColor: "#1890FF",
          color: "#fff",
          fontSize: 14
        },
        timeLimit: {
          marginLeft: 28,
          color: "#1890FF",
          fontSize: 14,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        },
        timeLimitDisabled: {
          marginLeft: 28,
          fontSize: 14,
          color: "#666666"
        },
        timeLimitIcon: {
          display: "block",
          width: 16,
          height: 16,
          marginRight: 4
        },
        timeLimitDialogBox: {
          padding: "0 0 15px"
        },
        timeLimitText: {
          fontSize: 22,
          color: "#333333",
          fontWeight: "bold",
          marginBottom: 10
        },
        timeLimitLabel: {
          fontSize: 16,
          color: "#333333"
        },
        topRight: {
          display: "flex"
        },
        remainTime: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 212,
          height: 34,
          backgroundColor: "#FFF4E5",
          color: "#FBB050",
          fontSize: 16
        },
        submitExamBtn: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 110,
          height: 34,
          marginLeft: 10,
          backgroundColor: b.palette.primary.main,
          borderRadius: 2,
          cursor: "pointer"
        },
        submitIcon: {
          width: 16,
          height: 16
        },
        submitExam: {
          marginLeft: 4,
          color: "#fff",
          fontSize: 14
        },
        manipulate: {
          display: "flex",
          justifyContent: "center",
          marginTop: 50,
          marginBottom: 90
        },
        manipulateBtn: {
          width: 230,
          backgroundColor: "#fff",
          color: b.palette.primary.main,
          border: `1px solid ${b.palette.primary.main}`,
          fontSize: 18,
          "&:hover": {
            backgroundColor: "#fff"
          },
          "& .MuiCircularProgress-indeterminate": {
            color: b.palette.primary.main
          }
        },
        buttonDisabled: {
          width: 230,
          height: 48,
          border: "1px solid #ccc",
          background: "#fff",
          margin: 0,
          display: "flex",
          fontSize: "18px",
          lineHeight: "48px",
          paddingTop: 0,
          borderRadius: "2px",
          paddingBottom: 0,
          justifyContent: "center",
          color: "#ccc",
          boxSizing: "border-box"
        },
        next: {
          marginLeft: 100
        },
        goback: {
          fontSize: "14px",
          cursor: "pointer",
          marginTop: "26px",
          marginLeft: "50px"
        },
        beyondDeadlineContent: {
          fontSize: "22px",
          color: "#333333",
          textAlign: "center",
          fontWeight: 600,
          wordWrap: "break-word",
          wordBreak: "normal",
          overflowWrap: "break-word"
        },
        warningText: {
          marginBottom: "10px",
          fontWeight: "bold"
        },
        searchBtn: {
          color: "#00000040",
          background: "#f5f5f5",
          borderColor: "#d9d9d9",
          cursor: "no-drop"
        },
        dialogFooter: {
          display: "flex",
          justifyContent: "center"
        }
      });
    };
  },
  64229: function (a, b, c) {
    "use strict";

    var d = c(87623);
    b.Z = function (b) {
      return (0, d.Z)({
        loading: {
          height: 640
        },
        testCategory: {
          position: "absolute",
          right: 64,
          width: 70,
          height: 48
        },
        contentWrapper: {
          display: "flex",
          justifyContent: "center"
        },
        content: {
          width: 600,
          marginTop: 30,
          paddingBottom: 68
        },
        topContent: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        },
        testName: {
          width: "100%",
          textAlign: "center",
          fontSize: 24,
          color: "#333",
          fontWeight: "bold",
          lineHeight: "33px"
        },
        testStatus: {
          display: "flex",
          justifyContent: "center",
          width: 260,
          height: 34,
          marginTop: 10,
          paddingTop: 9,
          boxSizing: "border-box",
          backgroundColor: "rgba(82, 196, 26, 0.1)",
          color: "#52C41A",
          borderRadius: 20,
          fontSize: 16
        },
        notPassed: {
          backgroundColor: "rgba(245, 33, 45, 0.1)",
          color: "#F5212D"
        },
        mock: {
          backgroundColor: "rgba(78, 184, 255, 0.1)",
          color: "#4EB8FF"
        },
        marking: {
          backgroundColor: "rgba(250, 173, 21, 0.1)",
          color: "#FAAD15"
        },
        testContent: {
          marginTop: 30,
          width: "100%"
        },
        topData: {
          display: "flex",
          width: "100%",
          height: 64
        },
        leftPart: {
          width: 42,
          height: 44,
          marginTop: 18,
          borderLeft: "1px solid #E5E5E5",
          borderTop: "1px solid #E5E5E5"
        },
        middlePart: {
          flex: 1,
          display: "flex",
          margin: "0 42px",
          justifyContent: "space-between"
        },
        dataItem: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        },
        data: {
          display: "flex",
          alignItems: "baseline"
        },
        dataNumber: {
          fontSize: 20,
          color: "#333",
          fontWeight: "bold"
        },
        dataUnit: {
          marginLeft: 2,
          fontSize: 14,
          color: "#333",
          fontWeight: "bold"
        },
        dataText: {
          marginTop: 8,
          fontSize: 14,
          color: "#999"
        },
        rightPart: {
          width: 42,
          height: 44,
          marginTop: 18,
          borderRight: "1px solid #E5E5E5",
          borderTop: "1px solid #E5E5E5"
        },
        testInfoWrapper: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: 235,
          marginTop: -1,
          border: "1px solid #E5E5E5",
          boxSizing: "border-box"
        },
        testInfo: {
          width: 400,
          height: 115
        },
        invigilateTestInfo: {
          width: 491,
          height: 140
        },
        infoItem: {
          display: "flex",
          alignItems: "baseline"
        },
        infoLabel: {
          width: 80,
          fontSize: 14,
          textAlign: "right",
          color: "#999",
          wordWrap: "break-word",
          wordBreak: "normal",
          overflowWrap: "break-word"
        },
        autoLabel: {
          width: 98,
          fontSize: 14,
          marginLeft: "-18px",
          textAlign: "right",
          color: "#999",
          wordWrap: "break-word",
          wordBreak: "normal",
          overflowWrap: "break-word"
        },
        info: {
          flex: 1,
          marginLeft: 5,
          fontSize: 14,
          color: "#333"
        },
        autoInfo: {
          flex: 1,
          marginLeft: 5,
          fontSize: 14,
          color: "#333",
          marginTop: 14
        },
        remainTimesItem: {
          marginTop: 16
        },
        attentionItem: {
          marginTop: 12,
          lineHeight: "24px",
          wordWrap: "break-word",
          wordBreak: "normal",
          overflowWrap: "break-word"
        },
        invigilateItem: {
          marginTop: 14
        },
        openTime: {},
        remainTimes: {
          color: "#F5212D"
        },
        testAttention: {},
        manipulateBtn: {
          width: 220,
          height: 48,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 35,
          fontSize: 18
        },
        checkArea: {
          display: "flex",
          justifyContent: "center",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 21
        },
        checkItem: {
          display: "flex",
          alignItems: "center",
          marginLeft: 25,
          marginRight: 25,
          cursor: "pointer"
        },
        checkIcon: {
          width: 21,
          height: 21
        },
        checkText: {
          marginLeft: 4,
          fontSize: 14,
          color: "#4E8FFF"
        },
        btnDisabled: {
          backgroundColor: b.palette.action.disabled,
          cursor: "none",
          pointerEvents: "none"
        },
        ManipulateDialogContent: {
          fontSize: "22px",
          color: "#333333",
          textAlign: "center",
          fontWeight: 600
        },
        warningText: {
          marginBottom: "10px",
          fontWeight: "bold"
        }
      });
    };
  },
  5269: function (a, b, c) {
    "use strict";

    var d = c(87623);
    b.Z = function (b) {
      return (0, d.Z)({
        root: {
          position: "relative",
          width: 1200,
          marginBottom: 70
        },
        invigilateRoot: {
          minHeight: 640
        },
        loading: {
          position: "absolute",
          width: "100%",
          height: 640
        },
        hide: {
          display: "none"
        },
        tipsText: {
          color: "red"
        }
      });
    };
  },
  22380: function (i, b, c) {
    "use strict";

    c.d(b, {
      k: function () {
        return a;
      },
      y: function () {
        return e;
      }
    });
    var m = c(37200);
    var d = c(30381);
    var j = c.n(d);
    function a(e) {
      var b = e.autoSubmitDate;
      var c = e.testTime;
      var d = new Date().getTime() + c * 60 * 1000;
      var f = new Date(b).getTime();
      if (d < f) {
        return j()(d).format("lll");
      } else if (d > f) {
        return j()(f).format("lll");
      } else {
        return j()(b).format("lll");
      }
    }
    function e(f) {
      var a = f.isExamType;
      var b = f.isPublishScore;
      var d = f.publishScoreTime;
      var e = f.ishasHistoryScore;
      var g = f.isSubmitExam;
      var h = f.isSubmit;
      var i = h !== undefined && h;
      var j = f.markingStatus;
      var c = f.testType;
      var k = f.hasHistoryScore;
      if (c === m.kq.MOCK) {
        if (i) {
          if (a) {
            return 22;
          } else {
            return 23;
          }
        } else if (k) {
          if (a && j !== 2) {
            return 20;
          } else {
            return 21;
          }
        } else {
          return 11;
        }
      }
      if (b === 1) {
        if (d && new Date(d).getTime() > new Date().getTime()) {
          if (e) {
            if (i) {
              if (a) {
                return 42;
              } else {
                return 43;
              }
            }
            if (g) {
              return 41;
            }
          }
          if (i) {
            if (a) {
              return 31;
            } else {
              return 32;
            }
          } else if (g) {
            if (a) {
              return 34;
            } else {
              return 35;
            }
          } else {
            return 33;
          }
        }
        if (e) {
          if (i) {
            if (a) {
              return 22;
            } else {
              return 23;
            }
          }
          if (g) {
            if (a && j !== 2) {
              return 20;
            } else {
              return 21;
            }
          }
        }
        if (i) {
          if (a) {
            return 12;
          } else {
            return 13;
          }
        }
        if (!g) {
          return 11;
        }
      }
      if (e) {
        if (i) {
          if (a) {
            return 62;
          } else {
            return 63;
          }
        }
        if (g) {
          return 61;
        }
      }
      if (i) {
        if (a) {
          return 51;
        } else {
          return 52;
        }
      } else if (g) {
        if (a) {
          return 54;
        } else {
          return 55;
        }
      } else {
        return 53;
      }
    }
  },
  56673: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAA8lJREFUSA3FlVlIlGEUhp0Zx0HtrmV0WmmjvS4myKhosYIoos2LCqKC0dEpo40WiAlaiCItzVGJumghiApaFDLLCMKm7MYIiiIo0CiiHUlnxp737/8npZnwJjpw5vu+95zznnO+5Z+UlH8stp7y+3y+QTab7Sr+dVVVVdt6GmfviWNRUdFg/Bo6Ozsnom96EmP5pFqTZGNBQcGQjo6OBuxKsqe6uvp4Mt9E+F+3yO/3D41Go3cIHITuhvyARZKfn7+A+Sw6msTWfWJscjgcV0Kh0DPLR2PSBOz5MALvEDiQcQf7fkgBgUDAQ0cV4Iu1RqKoQxP8foAHc3NzD+fl5QlPSXgGVDcC57six2e7Rc5ZjGxvb39okl/FZ7LL5cp0Op19mC/DtxU9WF9ff5DRkD86EAkVals8BG2B/Kg86WgUw2002263b66srCwR3lUKCwt7RSKRRuJGs13TKyoq7nfrQCTmgYp8k0VOR2MgakBFviERuRJB+A37Ojq0c3Z+YfEEZM9iXYdmQ74R8mNyoKOxDOqoH1oIeTljUsEexvieJF45xROQ8SzrAVSwF/IyGelovLYL577gfm5RSLgEzEZnB9BLv5DfvxTYgnqEGAlwmkvAHMCmrKysfTKY26I974P6qKxKuMQkDzHuZJltgOYPRTmZ6ryaBVkdrDYWdnsgGAxGUDvB58B6k3Q9lZ+UXWKSVzPNRx9nZGQsFG4JnQbwcaH3hBkvmcV0iN7xSBoFtrS0jGSYhJ5nu04LkygxL1vJ1uL/CLJ5JSUlHw0jPzzMKbFYbD+2N2lpacZVtTpQm68tR65YpuY4frAwkZP4FMWsBXuYnp4+l4Li5FySqZzjTWxOEq8rKyv7olijA4jaCEwXIHG73c2tra1vwdZzFmHGp6x3Y1qKPkDnl5aWfmY0hH2fBnktCxdceSS+ZZriZ/ASw3A9FBmoth3SNWAxxjNATYwiv8XLnceZxMkpYAZ+tdjTGFdwGa6IwxKjAxY1OHh5hWuYn5ARkpu8gXFgK1i6CW6kssuMnbJLOI+Z7Pl1pk7w5ZzXNcPQ5cf4VJgfsBfgUb4rE8rLy1918Uk4hXw25NcgdlDcMgq6kcjR+AqGw+GvXq83guMCgqbl5OTUgX1KFCAM8lX4XhA5B7qEymuS+Xb72LGf1i35TsCu1NTUU/q+WMH6ELJlRyBfBPk3s3LdnKTSLYG8SLKVwCDTTEj0fX9ukvUH0x+PpJnKV3KgT34tk//+kUCuxcXF7ra2Nh/E+tcagep2vSOZHuJFj8dziZsWY/7/5SdmV84BgH91+QAAAABJRU5ErkJggg==";
  },
  98544: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAvlJREFUaAXtWM9rE0EUnpfMNtAcKlhEr170Iqj/gKjooWmlkuZQhdKLRUEU6tWr1yqC1HpTDyKJWBraaz0oevEHvXnVg6KmWNA07E72+XbTiZvdTU2ms2zB2cPOzsx7b77vezOzO8uYuYwC/7cCkBR9MTE6hYhzCPjJAj4J5aWPSYyVCAFRHL2EzF1Axvz4dPvCM/xkEiQyulWxS4WZIHgvPhE5IFyxiqVzh3SPpzUDHnhw8b5UPgw2iUxoI/Av8JKMbhJaplCv4D0S/nTC5gtd02nHBOLAk8pzwKAmVafyKS3nNVmn3Wm/8EhMjh2WbarljgiI0sh0eM574K1nKzcIMIndujLAflhW9nSEhOOu4oXCQWmnUioTIBUBXbgbXLAAcNsH7yHB1hYqQcGTaiwJx8ab0kalVCZAYBEZfpOD+uAry7OyHsyAbPNJDOZOBTNBGfsq+1VKruIkfSyeGxFN+wog+8Aryw9lu1+GMiD74NHzGk6PnxC/nFkGWOf5fXdkn0pJAiRzOROF7zTNhr3otAbu8crK1SRGUp5CSYBRiWkIqKim08dkQKeaKrFMBlRU0+ljMqBTTZVYJgMqqun0MRnQqaZKrMjnNJZKA06mcdwaYmvwoFpXCarbB2fGBp1a84iVyb+HctkOxo9MIYG/q0w0XzvrzZdBw76fu5wH+o5DDs66+4qKN8KtL4X9IwToKHjGN0J2DKfO7w079FwPnIkZnT579gsZ0sF/mCEebTXj2VA3ixAInnHZJo/0hwN0rSN72+4DeNd+7veB/8XQgW0rTmQN9Bu/mz3PD1wUm/ZlQPicLVcfM1A8/Inmto6JEfDOvkTulk9QFbznzLPIbOGHibupT5G4aCm0GQIpiN4xpMlAhxwpVLbdhRx3s0gvkkoKuNpDOg272K7EPEQI0I63QT89h1q27rxjs/kYv1SaPGzhgSNrgD5hFsNGu6Uehy2SASu355rT+In0+hunf+RbmUibAmzQZ8QiYbueNhIzvlFgtynwBw1N/qVo3EDmAAAAAElFTkSuQmCC";
  },
  57972: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAA+JJREFUWAntWEtIVFEY/s84oy2M0YiioHwRQQoWRNFj004oHF2oSQQVkpmlRURERBLVoo3OqJnRIoqMUmsMWgRhtCmKEiMogx4URQZWlJnOOHP/vnN15HYd70NH2twDx3PO//zmf9xzr0TOcCLgRMCJgBOBmURAmCkX+nkPhNLM5KbDh92hBXPo/IVKMWqm7zYSKPHz0pBCLWwkNAOetNsfpkdYnpqZMQQ6qpBLGhCCvgmmJjNjdvgAuQMzw8VjPsx0DYFqlAeCB0Wd5jzjra+BNxFThlVDasSsCv9POasRVTGWt/L8oWF6iMNcI9BokgddB8RWIxm7PFtAIwqlAEQmM3kMHQnKNORPg2kr9e1V4nPyYvJCKd1orsqnjdPAYqhiK6LSUnupGMYi55QjOM4pbOTVIkIHSFAuSO+xXumqFbckGx0fkisypK5ybzRsAd3dyp6vI3QCXmI1+hK12BrPQVE9lysRugxAbokKYyXW4sJ6Pnv7oDiCGqoAwsxbNeJ5PH09zRbQb2HKYYWOaYwMYD8JaMlFnhcepBbw3AjZcU8SdUSitAa1fQ7nw3g03WyvFY/B/6ixZbi1BbRjH70uCtA2pCt13OrbeNZDf2gd6F7I3UHET43L9CHK2QrTCXZRAWgSqOVhC6gQuJ+I2sys47bJVsaEXmllWdArtQwUytLSrextdb0Vg1IGv0bFKVz/Xo/4mao/XMljVWvVIORmBSgi+kEFzGoJTMBRBK0fP1iuzZiyrdTHlMxWr5fuff9J/Wiedejy62igDuisRc1WYR91J9E1Mxt6/qxE9NJOMQJHZQD1C2spEn0D8xCAy5RXd+4XfXogZudZASqdegR9QU12aQGgNvtA+1V3n21nMuFAmVngq+AM3mVfInzbtUAR0Tx0WVtPL/UW+zlPyzPbJxyoL0DN6PmjamcLakLnb0hJpkWYy+BsJ+r0BUDlRpm6fQFeYQYwxredgphivBUP9DpFQcMQDQBoAe71Zzq5N7iGr34dpkZEtxK3XHdJM69srxb9OrlJx4RFtKSRs5Dqo/AQcSXR5uBkkKpz+SEXrKUq/JAgWmtheJROTkIVh5AwoKEIrkaiZACoD9aIJ3F8TZDkDedKoUrI/gZxV1GAcyaYU2yspj6lOMD5ehsuNw127hXvJB1OfUinvJbS8dJxWi+rPyt4dcL4DJ3lmFuw96uUKf5YAgpDmdEo9eptgEb4pM7IraFPPX7ySj6wVqhPS72wwdmlULoBW2UZAk1Lo/4fP+kuJOP/A4JpMJRKP+qEUAobuAxyS8wc6vnIBLNHvbn0LOfsRMCJgBMBJwIJjMBfgOIn07Zo/asAAAAASUVORK5CYII=";
  },
  30162: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAntJREFUWAntVuFy0zAMln3HC/AWTZ8g6SuRZLCtHYNtXTmga+G2JPBITZ8g6ctwFlKG2lxwU7vjBz/qu5wiWdL3xZFlA5zG/7oCdTaa1Xk0+Vf86ix6qIsw7ebTXQPrDI5gbhBxXhfR2ObjY2NwBByjgac6H521Y60ElIJf4oQGifnxJGgV5wwu+RTscrONdPvY5KNbg+ZeZpXS4yBZLUV3kQ044vY3aqXjQbL60Y7dS4CdNkV0ZwxOJcCHRJWNvgKYK4nVoJJBWhaii7T+ApkcxCWtgNquAqJZVFl4IfP7ZBcclEpt4BzfS4Adhmk5bZMg07KPRFWEX9pfzuDDpMw5l20cJMBBDQkFs1aC5SaPzlt680q2z2DgvdiVhrM+cPbrrQFJJLLKw3tAuBVdK3UxSMrvrDO4QbyWOQYP4nUm+j7pRYCTSI+QhFRc56jhNW3XD2KjYn1LO+ZJ9D7pTYCT0fb6RE3qoy2xDzjHH0WAA20klNbvgnj1yPOuw6kIXZNRfaCz7x/Howg0dWD5BdQnHru9/hAhbwK8E/igksS8E+ihvf88GhKWU0/mu9KrBvq2YdOAOj3AZRs6r0CVRdN2D6AvuZQewF81jNfX1Fep/z8PPnqrPEpE3yedCDTggHetJJfDdP2tpTevDQnQ860dMdtkUbzVLS8HCfCJCC1wPhFt4JJ7mK6oFe9IGMC8j0RvDbzkTuByF2DSewn8Ba7VJIjLhXypi3QhYSVAl8cbKqKZgCilroKkfBDdR8p9UGII8E2Qrn+Kbq8Bo1+Jw0vAOUeQlhO6Y+6ucmqXWzCskrvdpgi3Vyqrk4exzsOFb5f0SH9yPa3A8SvwG55eHB20VbhUAAAAAElFTkSuQmCC";
  },
  80117: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,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";
  },
  916: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAA0lJREFUSA2tlVtI03EUx91FVxCVPhR0gXoKbNhL1FMEBYJh0aaSmyCLHopgWhCCb/pWQT5EdKF6kAqM4YxuFvQWPdSDD8o0MhC6rCKKNsi5oVufX+z8O5t/tmn+4c8533P7/s/5Xf5VVf/xtLW11fT19bmXUsK5lGAd29HRsXZhYWF0fHz8di6Xc2hfKX1JXyeF2tvbN6VSqacQ7TK21tbWX4hu8ZeSy+owk8lsp+gOKZzNZrv8fn+P4FKy4lEUF2lpaTkMURS7TCntdru9kUjkfXGsxhV3SAcnQqHQKkkeHh5+5HQ6w4KRnvn5+csK26oVEdLNAOt1K5FI3GNXWjmQXqfqS1W5ifVsVniRaiUv8uQNPp+vn9GdzUP/xMTEaR3rcDjOgHNiY+eeFN1OliVkbHdJ/CHJdNrP+asTHI1Gx9CfCeYDGhn9esHFsiwhY5umyDlJhLCOjkOCjcRvNs/fB39NMpk8KrhYLiLk61ezZqd0IKSD4CmxQXhMdCNdLtdjhDVW9APGbvcUEEK2hp02SsFr7EqfJNBBjveBwrvD4bBHMEfhK37rONDlVvEVS4swGAzWsuAvCNifD+rUwazla8EUdMbjcXP4rQfbNwGQbxG9WFqEc3Nz90naqwJ2Kt2oPzXmA2o1huS7wpuVXqBahCR08X4WL+QfRM/LdRoz9qTGWid3VmOtW4RsjLcs/j5IZ0wAMqIDGbfuOEeHX7QfEmvE5H7SPq1bhMbI4s8YUtTBhoaGmzoQ3S+YgjFiC0aMb5v4If8oerGUi9eyU8iMNTQyMmLZuK4a6XCPGCB8IrqR3EbmN2Uddrqf1n6tF3SoHaKbfx/rdUcwZJnq6uqCSxpbUPxGgv99rXaglyVMp9M9jGiD5KFfGRoaigvm7LqwBQQj416v95XCBWpZQv5xvXzxc5OFHDNYV2DUx8H6oEf4o2R1jNbLErKmKTbSEciukugHZ6RAIBDYSHcXBRPz2+PxXBJsJx12xkpsEDm4/h4Sa/3/2Cy9HK/zpfLLdmiXnCe7ocnQ30E4YBevbS4NKtVjsZgf0gsSzygTrG1z/kiJ2VYui3BycnKqvr7erOVB3lnIDkH2xpZhJY0c+E4uhaaVrLnitf4A6sAsehavDeMAAAAASUVORK5CYII=";
  },
  78271: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAg9JREFUWAntl79Lw1AQx/0RwR90VNougrgrFAcn0UUQEUdRtOLQmA4i0j+gi7MuVRqK4ODgIi4Krg4OQgf/AilC27kUdEhbv6cmxOOlPZMKHfIgzbu7d/c++b4kr+nrC1uoQA8ooOv6fDqdnusGykDQIoBZabVaT5ZlPRuGsRC0XmAgwMzaEI1GY8bu+z0HBnJP3I/mtv30uwrkB4DnhEBcEW6HCnFFuB0qxBXhds8ppHFClZ1KpTbhP8VxH4/H97PZ7IdqHPdlMpmxWq1WwPtyCTEjn8/f8DHcFimEgrtIHMeRrFQqtwAa5oW4/QNzB/8GtpcJnHf4GJUtAkLBM0A1qQD6y52gXDD2ZttA/rkKgPvEew+WLYmiFwD6ugj0H2Kx2Hq5XD5C0WMqDN9hJBIpYJlIGTfMFpbrmsZ0aiKFqIhpmpeA2cOkv5RCyFk+xOme8Q1D84gVosHUFEq9A2SEYoB1+jBpmcTKUD61we+T/LdYLL4kEokSJltDFl3QkCvb7vuCoTp/BqIkBRS57eYbhgr4AqJED6hAMIGAGNQqbAvLuC19mihf1UQ3Nb4opvF/+QAFRlVFcFNPwt8E0JsqDl9d07STXC5X8og7btHWgS8KExmLTpZHB2AeEchnWVMI0oPQtknfQ69tqwiCgBXVECmEDVWvVqtXmFe5ZAKeejQafRSMC4eECoQK/LsCn7NuxnKjGizeAAAAAElFTkSuQmCC";
  },
  40053: function (d, a, b) {
    "use strict";

    d.exports = b.p + "assets/formal_exam_2f815fec.png";
  },
  44568: function (d, a, b) {
    "use strict";

    d.exports = b.p + "assets/formal_examEn@2x_0468b964.png";
  },
  45342: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAztJREFUWAntl19IU1Ecx93cn9TSiP74EggRBEFUL5llqfUUhUFQIGno1L30EEFvPkUv9VpBuuFI9KFFaP+WUFFIQdBLPQhBJAkVpKCL2lzStj6/sRN317ld73VKsAtn55x7ft/v+Z7v+XdXUlJ8ig6skAPJZNI2MDCwudDd2Yx0MDg4WBmJREaJ3We32w90dXW9MYIzE2PPBwoGg2uj0egT4vaTEjj1Mx/GSntOh3p7e8shFzGHbDZbnLylu7s7aKXDfNhFHcKZMkQ8FDGkBOlcocWI2KyCQqGQe3Z2doTpaUJUkuRBzJAACv0smDKccYXD4WHEHBMxCPAixldoIYo/QxBrxomIu4hpTgf0uFyumyrYTF5TU/OrsbHxj1GsXtA1gJeMgg3GyfqbYqBjpDudnZ3DaeezwjPWEIGbskZZeyl9VOP66UQicc/n873t6+vbvRhlhkOBQGD9/Pz8c4L3CgCBNyCSA9H0w0FaCcd20klI9ggRvBHqZ7xe72M9cYYgafT7/RsYyQsAuwDGeHWCRf1MDzRTx51muP1gN5KiDoejzuPxvNdyZUyZNDDHMwQeRcw4otaQHkDUoAWZLXPl3AdbC3eYvDwejw/Bn6Eho6I66ujomAZ0hPoHUhmgR+zAg6rdSs40fYL7onDAu5MZadHyZRUkAYzmO06JqI8AKyAJ4VStFmy2DHcAvpeCh/uslmdRQRLE/H5jUTZRnAC4jvkf7e/v36olsFC+LVh4G+T8Uzw5BUkQo/lSWloqV8gk1SrmfYcCW8zfpfFup9NZrbjyCpJAFvokIDk76hH4VIGt5Azwh8LjfJUqO1QhX97e3i4741W+uCW0b1GxXE9TqmzIIRW8zHm98OHUTGtr67TiXhVB8q3FNHlFBIs6hCj5qkg9qyKIz5sr9L5NFLBhbqWUpH9WXBAX6ylcuZDuf4QN81oryPCi1oLMlOUvVCwW6wF7niR36ATuePRcCy5XfYBciIzosP79Euqp2574OlLKANbMOMfIcXbuZz1PTkGMqmJubk62+3I5+Rsx13HmMrdA1r9TOQWJeub8KpncaWYf6fgrQsbcbvdIW1vbvzPHLGERV3Tgv3LgLwMuIKNFjHjSAAAAAElFTkSuQmCC";
  },
  88683: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA1JJREFUWAntl19IU1Ecx9uf1M1yI9JE6CmCQJDqpbKsUOghCougoIKgwKkkaNibDxK9tCdlG04JqseMSipNqEikh6A91IMQRJJQyRLCWFtN2tbnZ/fK3dyf272VBDvw85x7z+/7Pd/7O7/zO3PVqmIrRsBcBGx64alUyhIOh6tCoVBUL8aIn0UPqKOjo2JhYWEc3x1Wq3X3wMDAcz04Iz7WQqD29vY18Xj8IRHahW8SQZFCGDPzeQW1tLQ4E4nEKAvUYwmLxXIqEAhMmVmwEDanoK6uLgcC7hOZvfQSmTPBYHC4EKHZ+aw5RM6Usk33ID+ApRBzFjHXzS6mB78sQr29vSUk8B3AqhjPvxIjgtMiRM6sZntusU3NMklkesrKygIyNtrcbvdXPvKHXnyaII/H40XMRb1gPX6Sf/h9wiaxm0T7Lu9SubCZW1aZy9Hoez7QilVjx7Hbra2tLyglW3PxpUWos7PTHYvFnuC8XQH46aUgGm5EowLwZuwIgrYpRFH6E0NDQ6PK81KXJkjectzXRaPRpwzrsO82m+0wlfmxzJltpEQzoq7Csx6LIbZ+cHDwlZZ3mSCZ5NhXcuxFVC2gb9hB9n5C5sw2Ds4mOEKYG5uqqampI+klzxZbZg4tvvT5fHMOh6OJh9d8kSOZTD6AaM8viLm/bNNbPvCCwlI7Ozt7UsuYVZA49Pf3h0tKSpoAv+GxHBtra2vbKXNmG9t0Dd4Jhee0li+nIHHy+/0fEdUIeJrHtdxr45yQjVoCo2M4byjY/VL/VJ68gsSJ7Xtvt9sbGc5gLkRtkfdmG0X3pXCQEqXwV6t8BQWJIzf8jNPplNrRQLgfqWAzPYK+qHhy1KWO7eqgUN/X1zePz7NCfnrnifQGja9U8sWmK0Kq85/sEdSg8H2mzs2p3CsiSH5rIcAjIkjuMWzpblsRQVxPl9EiBVIEBaVXW9ZKrU7+jZ7L9RgnaxiTYIxQKI9q19Gd1FqQkTFCqhDRw4k6D57AWKY5uecyuQpGSLkQ92UC9T6zsHrb1yNIDcAUx/4Q9+O7TJ68grq7u8sjkci8higT/1vPiIsD8Llcrkterzfrv1N5BclqlPUrEMlFa7TJwh+wSXhGiMpSzTFKWMQVI/BfReAnYzMcfkNsqJ0AAAAASUVORK5CYII=";
  },
  20992: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAyZJREFUWAntV11IVEEU/uZqq6XVZtDmDyYmVo8FQkHgS5BEabu2RQ8FQhhkaT33oL72sqb9YPQgRlBJKQsiFLbanz30EAVhQT2FkJAPlqv7c/d0Zta7LOa2eW+7VNyBueecmTPnfPPN3DtzAbvYDNgM2Az8fwyc6KcC9xXamDwz71Xa3NxLq4w27z1yHO8il2GblbnpBnLSNdMh7BUETfrqGt74z4kpqc9+xWMCdnlvkmvglJhx+2hPKIwXXyLo4+4m6ROeQn+IcOywj3YOXRCv1cR01Mg+VXLwafCs+GCYqWRaoNNBNMcAnxGAAQ+y7lm0nSxzMYdCljM8lfVgZy6y3SiGrmQsgk6eXIvRCcIk6zsSdgolLVDSkK+SC0wKqPogEUtwGs4azpVPIKYs1atsqbGidJETl5SDERFDKTfmc0sdu+SpEWkeaYEa4zXCXV66DsOWkoFfFBq2Dp7BZ8EcFWqY+Ebo4D0ymvATuMR+E4VOvJJt/lYxzGLY00vF0SDUFkr4/kL5baDLxRg6L+7LdtEW773dKmZZ64xb8ae/TQRYk9VSUS+IpQhZGmwD/dNEZ41R+dFv6KZ9ZieQFaCebiqbIzwjHY9Y320GbMaBei9TeVTHOIOr4vq8wIm3fx1QPjYrwqRAVgqBJ3kO1N06KeayCtTdTbXu67QpVdLGa1QZExgnQgWDDKwrwoGBFvE9lX+6dlNL7+miGj2GQGwBT+t7qGRpEr5BVUXDzCShnEGOulbjoFkmjdimgBYU4R0fiy/5vK4WUQTkcWgE5NtRdTiimCxjn4eOEhy6cVoEjX6z0hRQyQ6f63V82Cuw+nwcbGMPbefb0Rgvdwn3jWxwomHgqJg3Cy55nCmgMoA819dq2K/AErbpQYxFdAYJFDOTw1s0uPuaxEJyMiu6aaA/geVtwHvSxXvS7yiFp6dVhKwAWzrWEtBksPLzw/UOvzhHeLnDSxNZtS1d84zki9e7WsPOhLTMaCZALRfTBrocK1ba/hlGf/tl4r/g9noftVthJXks/9itqKQFyqfMR/6oy7CZYv/9ihDbzjYDNgM2AzYDphj4AWL9/GlmFBVzAAAAAElFTkSuQmCC";
  },
  37002: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAA3JJREFUSA2tVktoU0EUvTeJaQVRm4WatIoFwUWFbkRXRXFRKKhoQUUXUlHxU9MqiFBX7U4ES5v6VxBRF1ZQ8S8ILsSFG3EjihXqJyaKtFilFY1545nIHe9L06TWzuaeM/dz5vNm5hH9R6vpNeHlD03oX0r8U7AuvCBhpg+k6NpgipLGmCZmNto/Fp6Q4NweExv26A6K1lqVWDd9gWkdS0T3BzQZL84SVSN2ocRDtCXWbQ4IL2a5mLOYL5YwqzyPriImt0rM9CMYokXJZn5dLG/cM4x1ma3zz5lyKZZq4ZsQiQs3hsqyGUoIH8uOSzDabTo9orM/huhSuzEuJ93KJyH6SIpjaRsqu8xK4YWsSy7ktH2YWQdGv89iFGw83U27LZbGQdpLbF1/WpZph+BCtqRggOkiZjEgyajcUXXWRISn9vBTHIh7woHrsfQzhefbkoLJVu6D6H5JhGAkO0xNwq3FgOzHk2vwhzPfaI3wfDtKsKrXTMWe7dSByTidx+f8QvpQdINga8MhuqWX1TO0Qvs19gnWHDPTsmm6iz07AdG1Epi7RZiuC8eOLcZNUyb8TTN/xIDccUD+XPHlWyc477ipGMjQAwQvywUZ2qyDUfCJ4oERpmrFLfykeJXCPugEMxm6DM9S52WqcRjAMA1qjn2r0Bz4s3AMrlJwvnWCHKAWBH6QAOzTO8HWBjyaoXmQ6KvmPsw04uOKOMFUnF+Gg1SHze+3fszgioojHPe/M8a588oprf3YV73ESZ9PESdo+97GuT8Upjocg/M74nRGxRG+vEbFnye3sW+J4ZsvfqzOe8H5dtTzlNzFdlmb2tVjg4u6Hhf1Epds6LbDAJUJU5v1yB12bE2f9mvsm6F2CLZvH8QuCEexn1OC/ks6a2iT+HOW6ZqPK1JS8JdH9p2b5XKYjr6Pc0r4ul4TxHW2UTi+gRS247HjeaCkYDBKbZjVfZsH+zQCrms8TtMW7Jk76Ii50s6Mx6VwKymYXM/fIzFajQ/pOJ7axufr+aeUqu4ysyF2WDjsMIfoiOKjIAY0sYYfJ44m6AaOg3v/MKi2VCsfKlax5AwLJVsx/Did0mI4t68qotRZKF73TUgw1kNrsZTbXSGmoUCINujldr48MCHBdAtfxYwO2lqwIyiy8kMzP8urPfl0TsJsntNjGia/8iRW/A2Fhv1vcv5dXAAAAABJRU5ErkJggg==";
  },
  46772: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,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";
  },
  51406: function (d, a, b) {
    "use strict";

    d.exports = b.p + "assets/mack_examEn@2x_22f01507.png";
  },
  67246: function (d, a, b) {
    "use strict";

    d.exports = b.p + "assets/mock_exam_93a68ed1.png";
  },
  8248: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,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";
  },
  32475: function (d, a, b) {
    "use strict";

    d.exports = b.p + "assets/photo-calibrate_f1c7c61d.png";
  },
  35755: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,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";
  },
  41260: function (b) {
    "use strict";

    b.exports = "data:image/gif;base64,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";
  },
  66888: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABW1JREFUaAXtWltInEcU7mrSpC9as95bmxWNd6hWC5oKClIIooLik+BDrCLeQJCWri99KFJZEAW1tmipL/pQhMULEi2lWtQI0dQHWWw10UZqvXQtSqnGVO35Nj3LdPPv/reF7EIHZs/M+WfOOd8/Z+ac+dXwyvPyGpEUqkaq156zfPb3KVlmp2qjemKgHxifR/UqVX8qz8jY2UD6eZvq6/5k+b+2wvbrAfQDt/HXYgQAX/d5Ty/3GgD4dfkfwMteviveMiA8PPxKU1NTgslkCo2MjLwBubu7u4dbW1u/d3d3/7y/v/+3t3SJchAHikWG2nZvb++7hYWFBTExMRmBgYGIKS+U8/Pzk+3t7R8nJye/a2hoePDCAB0MzQDMZvOt5ubmD+jNI4IrLrQSts7OzoH29vYNxZM8DNQEYGxs7E5RUVGtwWBAMHGW4+PjJwcHB5tHR0eHYAYHB98ICwuLDQoKess5iBqXl5fnExMTX5aUlNwT+VraqgEsLS3dzczMLGVlFxcXz1ZWViY6OjruDQ8P/8Z8kVZUVES1tLTcSU9PLwoICHCmLMvLy9asrKyvxbFq26oA4M0XFxfXsxK73f5TTU2NxWq1HjDPEy0tLQ3r7+//yGg0JvK48fHxz/WsBFzAKYyFSlH4fF1dnZncxhE7Njc35zMyMj6lt/in1Hgp3tra2l+Dg4Pfl5eXvxkSEuJwq4SEhHfOzs4ezs3NOdxOap4nnuIV2Nvba+cNizefkpJiljoaBwYGcvLy8nKgdHZ29n51dfV9VwNw5Npsts94JbCxIyIiPnYdp6SvKBLjqGTj4fNwGynjoTA5OdkUHx+fj4q2lBGYCxmQheeQDR1SY+V4igDgnGdB2LBKfZ7nSFHIgCx+JupgnhIqCwDLjSDFwnDacFsvFWVBB3SplSkLAOkBR1ic8+6OSrWKMR6yIBNt6IAutNUUWcTIbVggghS3QbFh8/Pzb4u80NDQm9xPTU3N2djYiOY+KPm6lSLxY+ZBJgc6URc/l6OyADgxgyCOsCw0KSnpZlxcHO7TkoUisQlVfEib+wfqOwGIMkVd4hxPbVkX8jTZ288oxbhUK1N2BZASs1DkNtwGHRoaWqCAtiPycnNzb5MrONyKUukFClAL4vPR0dFHYl+USbHmD/GZkrYsAOTzLAiJGbdB+/r6nqCKvPn5+TcYwM7Ozi+VlZVwGbdFlCnqcjvB5YGsC+Eygnwe87DZkJi5yNDchSzewNABXWqFyQJA1MRlhAUjq+S2XirKgg530d2THlkAmIybFAtBSoyskvtaKWRAFs8XdTBPCfV6MtfT05NFscGR18zMzDxobGxccjUEEddbyZxiAEin29raLHwLQzqdnZ3doXbZYfzi4mJLbGzsewCG21lra+uHWq+Yiu8DyNfpJnaUmJjoeLvI56uqqtLX19dXkOe7vmWpPtxmamrqk+joaGduRan5WllZ2TcaQoBDhaI9wMbg5oRrIPeRz4+MjHxBvLueTic8wxiM5TsAy6DUI2V1dbWRciFmqaKKXUiU6o1LPS5FMJ7l0ip+m5aW1k3HKbMUUU0AIFnPZ5Wurq6vLBbLOr35Jsqn3mdLtYDQDICV6vmwBbfRC0I3AAYSFRV1tb6+/hZSYs4qlXxa1AvCawAYiBaqB4SqU0iLcUrmYONiA2MP8HjsDbiX3OnkEwBgtFYQPgPAHQjaU5kFBQX/uYfwKoH6FABXEKenp4e1tbWt09PTzkuVaDzaPrGJXY1CH76PN+/JeIzzWQAwTknxORdSYrQ4BgDwvwf+Wp4CAP5xwl+LHQDwXx+Or8R+hgI225CE48+fv1K9TvVVqrKfWmjMyyxw+X2quKqe/ANC0ooCitNHSQAAAABJRU5ErkJggg==";
  },
  55132: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA4pJREFUWAntV11IFFEUvufOmFZaEhKV/SiVmuVDQZS5LPYUSBD0EEGUSZHQ0tZDjz321EOhtYERSIhP0UMPBtWL2boFEtmPWlGoGREZIWmx6szczplxhnEZ79y1J8kLu/fMOd/33W/PztyZYWxxLLAOwHz8DrbWFqYnjDqLWXuZxdbZGpx95Yw/z8vXH5Q2dI7NR5c4WRkauX1g1fjvX5cYwFkhRG7QogAwyYS4WbB8xeUNpx/+DMLIcsqG+pqrd6L/+7jYBpmgVwMYYUwc2h5/9tLLKQRcAcMGrker0EyXawa7kAYGVwB4NdeWFdGHYicHaVvTNg5dDldlFQcT2qHvidr8H8bkG8FYyQylJ0fX68tiXQNBy3xIRLdNG8Yd7M5uquMCQ0V6btXqWOdEED4zF9qhUWPqomsGxV9Xri2OzGWGxKlGGMLSMXFJg2KVITUkWs7kAIgLthCwaQ20E3Dk7lSYMGF0HeqxPdOEJQ3SCuNRXWpoYLqvVgi20hYS0FoeT75SESVMWSzVy5BDMWmQFsVhQ2qIWWKXK6Bx6HBj1XkWx6cl40sN4XngbHqoIJg2KBMKqvk5fq0grJuTGrIE/PGAQix1Y9WZ+zh+LRlfagjPsGGXbIBZ5saqsynMchfLgQ25sWyWGtK5eOGSQbCjbpzF7HEAmKcl4+NfKx/9TftwUxQ7EGhxrkcrzj3tljOc6vtEJGIa5hPch7A58LbyfAp3+/Ah7RDRBYhr9ozCljDaPiaiofeyTy2RjWimjcwQl3N2lWaVEdohEsEudWCX6mxBYF90DQ6Xx1I9QQv03YjsAdO8h2aKqY73vY7KeOpgEDYoF9ohIuWAdhKleynG63+9YbCUc/e3M96XnTOtpGuGODlMa/AACoGSoa3xp6NaPkRxgaSjKXRN8MJMfScndCcPSeIQNxMnO1YyRAIVp7rHgYtHMjF/jbDE8edU4plfowKdjbFANPQ31ez3ZzFXQrf3fxnZGcJLjk4iGvgIe9yNPQN+MzbWqygHyn8ZKQrOH7uPFNIV8LHDxkpBwUWly95PHUzUrplixhZ/LjNewvSPpbHOb5n5BXmcdYfoV4Y9/UHjLftJcT4dydoQ3RbSaXNYtlhenrZpc2PyswwzVy2rk5pErMmCMftlcA5FqhFmjnJoOusOkeK75ppj+Bp9DHdubfYKwsTX6faKeHf77Pzi0WIH/uMO/AW7ySFaMTJMkgAAAABJRU5ErkJggg==";
  },
  75572: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,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";
  },
  33146: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAyBJREFUWAntl0tok0EQx5vEtIrQGq0VhAheCopGEQ+C1OpBqRERPBQRRBr6okUQLIg3e5PqQW8maRIjAfHoK6WXogdFBA/1Ua/FFkRQD0UhMS9/E7Mfm2e/pI0UzMJmZuf5z2R3dtPU1BiVK2CprK6s9Xq97Var9Ww6nXZZLBYb1nN2u/1JX1/ffGXP8tqaAQHmGCAeZjKZrXp4ZL+YwwMDAxFdbpavCVA4HN4Si8XmSNJB8tfQZwBLwh+BnmQdp1IHPB6P2FQ11lVlnTOOx+NnYAXMGypxGJrOqW74fL4HgDqXSCQuILuWk5smVtOWmiEJ98oSOqWBURZPhUHuUoJqaE2ASNAiSdjQvwuTASSekzUX6sysawVkJnZNNg1Ay5WtUaHlKpTXGP1+/3GugTGcdnFa5CooN9o48htRLmH3UzdCvoG1gxlH913X6Tx20kg/MSfoZTNKZwCanJw8nUqlHivFv6IAypDr1ODg4JTkNDo1YMZFgMF9+sttKlXUY0S/WoMczeQco1LnyXmduPmAEHailHwT/f39H4Wp9+CauSmAyNOpchkVQvCeeQiDW+ylu9C6Voj40u1HBAj8B6EyDECU8Co/0zTKHmjPX3V9P8klWyQGNS5hY1NL6kAgsC+ZTEZg9zDnmV+Y9RhtBN0NmK/ME5yydypJHiAR8vC6B7mI4WV2/h2RrfZg73RTlefEnR0aGtqvx290ar0apfhGhUpVRZetuQoZfUhHWYqPRqMtCwsL3U6n84Xb7VbP1KwpjXQnzGaO71vdl5Nk4UQdtdlss3T/H7quHG+6QouLi6MEmYYOFwajkU6R/FUoFNqk6+hrXaxnuLNMtw/TgAi8LZdMUT13B4DkUZ8HCCBZW3paKR/d3+CrAWQ41ZNZc4CKNjXlXaL8UgQX18gO/hJnF9xxrSJE1xoMBp3Cq8G/1OzrErodXUqTt+f49boPdgdFLrmUraJFgFDIq/ESiT1QD87KVtFRZLLBiwY+L0vYy5foQv650AH5o0JZ0eUqBhxVD8ZX+AZ5lSh0XsH6G/EjDodjvLe316joCuL9R65/ADjONIf5xwsYAAAAAElFTkSuQmCC";
  },
  53655: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAxpJREFUWAntlktoE2EQx/MiqQRaH7USQcGDgqKtiAVBahWiVEQET1IQwUOaRwM5FMRbvGkVotSS5CZSEMnJqoReih4UkXioj3iToqB40EPRkKRp4u8Lu8uX3TbdhER6yMAw883MN/Pf2e9lsXSofges9d31vT6fr9dqtV4kqh+2w1nGTxOJxCJ6U9Q0IMCcouJjeLuu8l9A+ZPJ5IzObmrYFKBQKLStVCplK5VKH8XfUOk5egl5Aj6LrYA8AqgssiFyNBStBK+srFxQwLz1eDzHo9FoWXHdpHOP8F1ifBm+rthNC5vpSCmQgofEkE6kJTDVCJvN9kzxiXXVMDULyCUqlcvlor4iYMXvsiCdep+ZcVOAzCRuNqYDaL3OdTq0XodqDsaxsbHT7I4JtvN+pLgK1qIeHG7iloj7Iwdh24RtC7KA/CX7dHqJmM/wJFfNvOrTAAHmPAlmVcd/lBW73X4uHo+nRU35pL4hDCB+CN8lyHDGCH+riNPeyTk2Qb5RZBRZC4ju7BPFHA7H5PT09Ceht5uCweBt7sRRtbaop3WIrnzAcYyAO/y+BFdAuzvkoktB5aM/qh+vAcJwDZ4D1AhyhGA1pm2SWiJ3HtYuYW1RCw+dGUDMEHiQji2i/4DbQT3UOEDin6zVMyzo92qRGkDCyPPhAeIKgCK8Z+4JW6spEAgM8wdeUGOBGofl/J2TWu7GanqnQ6t1RbZtuA7J55AM1KCHw2FXoVAYdrlcL6empqrPVDVofHx8D7tmK9v3nWoTkq1t5Sg56Xa7F2Kx2G/Zt5ZuukPFYjFEkjmkX59seXk5DaDXkUhks+zz+/1DjOdzuZzp48M0IL52h1JMlXLtPgbOfD5fA2idOfJ8TTcNSJvRZmXDATIsao5z8QoUC7Kfa2Q3z5HqDcga6RZ2qJtnwy65Ufiqr0teCDvxabcyL4deJa5LnoP9qGJfkvMI3QCIpLMUCOO7KpjJIk4jQIWwiQVuIOyvDEYMzBnC91Xvw/5EbzO8mzOZzJfBwcFvBO6Fu2DxLmo1fyfnfa/XeyuVSlXbzrhDpjrwD7o+TYK3GTR2AAAAAElFTkSuQmCC";
  },
  46327: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABSRJREFUWAnVV29olWUUP+e9k7mNhE2l7TqkQioTFjisrDAWGbq0LFMLSoSgKau7RVJQ1JYfDOlDc26EUh8iDbn7kJWEaKZRSRRWWDZMp/3Z7rRa4J/cWve+p9/z7p7nfe97/y7oQw/cnfOc8zvn+b3n+TumElptl+wGbE0J0AkI0/tn2/jeUvBOKaD/EvP/IFBZQS1V5XSl+THT67kqAvsuxVROpUdzYXLZynIZw7bTLXxebXVdcln1kBwd2MC/hmxFu1wUAcCcbim/RLSchR5C9x4RmhqOQ6JxYvoIMl5dR7uOr+bxMCZXvyiB6DZZ4aboVQRflStBThtTAovr6UQbm91TsOUlEN0ulTJGO/G192dlYBJUYwRf/Dt804VoBgl6oeYwvVbJ9NSpGP8VctluVpDxYPAZ7ijthXqzRRK5GCKOgPjMatp/bC3/qb76uFS452ixuLQKZB4GmYj6gP8K89V8pp3PqS0oswg0bpcpQ6P0MUALFQjQZ5EIbRh8kr9VWz5Z1ytzJUm9INFkMUyH1sfork5m19rSStY5kBijLfD5gzO9Ea2gpvDgtd0y0/zCCYdbuf/6Brob1eq1PpDZ0U2dth9QMioQ7ZH5bpKOBvx9w220hhkzjobdMO2y0EZ8xiP4wqvZoc3DMX4+gM9QsWXfRODatNElh+48G2NTXdsyKiApetF6mAacClqng+M+WHBJqN8VesEMbnEFlCqHHscB9X0a4mACNoXhlkB9r8zBir9PAVhFzyVa2Dt0UOobYD+IgaPqL0Wa1e8IPatYVGPRrG65UftGWgIo/VJ1gPXPgzHqM30RMUvnLahXqH8ycqid92KeT2hMSmiF6kb6BAgLJ93A9F0tff02akZ/vvr+jUT8Ho0DmdtVN9ISgONadcD4uequ60+L2iYrnYifD9N8TTDeEsD81qjDcSihOraTJWZtk1SwDvx8RLM7Rey4/m3ImGPUyjRhskcnTOUT1hx/XVpft1UezOExpv7hNvbmGzlsPuMIHkiWAECGpbe9UPY6A/Sa0C+Qt6R7GQIxNcHKZTiZTmrfZapVHfKPgO6vASQ6Yx1Cc1XHjvhQ9clIrKkDFp8is429BntwOnwCmPevFYQvsw/KKqbdCDK3XumN6TwW3k4NwJQuVx1r6pDVodjFACUecCyo75IG08dhcgFVaAv4iqrItXHoCR4xwFk9YhbxokDQ/oDuExiM8RdgN+A5cben2LuUvC4eFm+jQs/Aj+IUaQ51AG/fjXjMbEaUXs8/XteQOaW2AiYtrpxOTY/9uiS6VVq1n4jxK8iyGNPxjdoyJNN3qNRSXDab1I5jdx3yrNS+ubwON3FS+0Yin9/MsRvtpk8RdGvamkTS1dhO7/gobOQemZd08VgR7yU0gq/4crCdjwUx2J5L0N+DXN42NsRxrd90tIX/DuIyCBiHmTOU7QgCp3vAibJ34I5/Ocw+mEj1VXGJfJKgdnzaFlt6pgtlZdQ42MqnFKcyi4BxgMRCXE4HMeEVFsj0A8AvVZfRe8dbGY/kzGaeZckELYO1A7956kXMKMg8gCruU1tQ5iRgAB6JFMVRifqMAKYx2I4g6U+w/4YEplKz8bsN9soQdgQP02VDMbZ3S9Bv9LwEjNM8TvEy3oHE2S9jAyjc+pwpeJq3sjlJ87aCBDQKC6oRunl6NYNM3rsByUy5P4g41IM35GGNLyRLIqAJzP8K7jjd4WAHuPhfANu2BgNexE45jfVycloVHTjxGF9UfCnyH9/Tkb/EB2diAAAAAElFTkSuQmCC";
  },
  9549: function (b) {
    "use strict";

    b.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAVCAYAAABCIB6VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG7SURBVHgB7VPRTQJBEH27aPxTOvDoACtQCgDPCoAK4Ez8Rr9MNAh2QAmHFOBRAVKBRwfoN3fjGzgIXO4g8ZtJNrs7u/N25r1Z4GiJmX2HtZ50eMHJOhPBjzXo+54JDwK7PSligfIy8AStWFAyAh/ZkY4YXBYWeNKt/2CCXODqmwyMwS2Xcw7HAhVmFCC/IuEUchS5+Bp5prI+szuvGFxLDO/DM6U0iFbD4aT9+rhd4C5NmU3dmyPD3GdxYmASkRb3Rcrp88gsMw7zgQVTZr0TqEDRGXwGvhcM2tEpetWuNLBbadnuA6bKA7Jev1ER13a6CihQH+VbSy5YBFthRaLU6R/mAmsg5RifA99bPqUnZMYdbb/EF67PSdEnpzF9fi6w2ujeuHSqGPMoXtGiFBBgSv+MY9leayH1LsVupHFyP0itK49a4i9wFayy3ph2CIUMSN1k6JlmVrzNA7YWfU5z0jJxX+VmA8q1glKwC5Nkn2V7v7Rmxt/XV0ETl2ZeZJCK2Mz7zgeBdx6I0WZ9LZZY8lPU/CdjR7tB1xTP4eUyh5/sh6NUJ2zbCQ4Yv/gsyUDnsSR+9vLBrI+2tD9OUqJu1vXrywAAAABJRU5ErkJggg==";
  },
  25893: function () {}
}]);