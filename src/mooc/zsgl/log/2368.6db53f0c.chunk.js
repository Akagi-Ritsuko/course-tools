(self.webpackJsonpintelligent_portal =
  self.webpackJsonpintelligent_portal || []).push([
  [2368],
  {
    63340: function(e, t, n) {
      "use strict";
      var a = n(67294),
        i = n.n(a),
        r = n(87623),
        o = n(52543),
        s = n(5555);
      t.Z = function(e) {
        e.width;
        var t = e.height,
          n = e.bottomText,
          a = e.imgUrl,
          c = e.loading,
          l = 250,
          u = (0, r.Z)({
            container: { position: "relative", width: "100%", height: t },
            inner: {
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -145,
              marginLeft: -125,
              width: l,
              "& img": { width: l, height: l }
            },
            text: { fontSize: 14, color: "#999" }
          }),
          m = (0, o.Z)(u)(function(e) {
            var t = e.classes,
              r = a
                ? "".concat(s.EU).concat(a)
                : "".concat(s.EU, "trainingClass/emptyContent.png");
            return c
              ? i().createElement("div", { className: t.container })
              : i().createElement(
                  "div",
                  { className: t.container, id: "examResultDom" },
                  i().createElement(
                    "div",
                    { className: t.inner },
                    i().createElement("img", { src: r }),
                    i().createElement("div", { className: t.text }, n)
                  )
                );
          });
        return i().createElement(m, null);
      };
    },
    45759: function(e, t, n) {
      "use strict";
      n.d(t, {
        Z: function() {
          return d;
        }
      });
      var a = n(27853),
        i = n(84531),
        r = n(51937),
        o = n(13094),
        s = n(67294),
        c = n.n(s),
        l = n(28122),
        u = (n(57833), n(67631)),
        m = n.n(u),
        d = (function(e) {
          (0, r.Z)(n, e);
          var t = (0, o.Z)(n);
          function n() {
            var e;
            (0, a.Z)(this, n);
            for (var i = arguments.length, r = new Array(i), o = 0; o < i; o++)
              r[o] = arguments[o];
            return (
              ((e = t.call.apply(t, [this].concat(r))).video = null),
              (e.player = void 0),
              (e.state = { id: "" }),
              (e.getSource = function(t) {
                var n = t.playUrl;
                if (/(.mp4)|(.MP4)/.test(n)) e.player.src(n), e.player.load();
                else if (m().isSupported() && e.video) {
                  var a = new (m())();
                  a.loadSource(n),
                    a.attachMedia(e.video),
                    a.on(m().Events.MANIFEST_PARSED, function() {
                      e.video.play();
                    });
                }
              }),
              e
            );
          }
          return (
            (0, i.Z)(n, [
              {
                key: "componentWillMount",
                value: function() {
                  this.setState({ id: "id_" + Math.ceil(1e3 * Math.random()) });
                }
              },
              {
                key: "componentDidMount",
                value: function() {
                  (this.player = (0, l.Z)("#".concat(this.state.id), {
                    preload: "none"
                  })),
                    this.getSource(this.props);
                }
              },
              {
                key: "componentWillReceiveProps",
                value: function(e) {
                  this.props.playUrl !== e.playUrl && this.getSource(e),
                    this.props.pauseVideo !== e.pauseVideo &&
                      (e.pauseVideo ? this.player.pause() : this.player.play());
                }
              },
              {
                key: "componentWillUnmount",
                value: function() {
                  this.player && this.player.pause();
                }
              },
              {
                key: "render",
                value: function() {
                  var e = this,
                    t = this.props,
                    n = t.className,
                    a = void 0 === n ? "" : n,
                    i = t.controls,
                    r = t.width,
                    o = t.height;
                  return c().createElement("video", {
                    id: this.state.id,
                    ref: function(t) {
                      return (e.video = t);
                    },
                    controls: i,
                    width: r,
                    height: o,
                    autoPlay: !0,
                    className: "".concat(
                      a,
                      " video-js vjs-default-skin vjs-big-play-centered"
                    )
                  });
                }
              }
            ]),
            n
          );
        })(c().Component);
    },
    83057: function(e, t, n) {
      "use strict";
      var a = n(18489),
        i = n(84322),
        r = n.n(i),
        o = n(33032),
        s = n(10522),
        c = n(18041),
        l = n(58971),
        u = n.n(l),
        m = n(63468),
        d = n(71254),
        p =
          "learn/app/clientapi/trainingclass/cloudschool/resourceReduceHours.do",
        A = "learn/app/clientapi/trainingclass/cloudschool/isRemind.do",
        g = "learn/app/clientapi/course/queryCourseDetail.do",
        f = "learn/app/clientapi/course/queryStoreCourseDetail.do",
        h = "learn/app/clientapi/course/commenthead.do",
        v = "learn/app/clientapi/course/comment.do",
        E = "learn/app/clientapi/course/commentLike.do",
        x = "learn/app/clientapi/course/makecomment.do",
        w = "learn/app/clientapi/course/commentOneList.do",
        I = "learn/app/clientapi/course/uploadCourseLearnStatus.do",
        b = "learn/app/clientapi/course/bigdata/courseLearnTime.do",
        S = "learn/app/clientapi/course/bigdata/v2/courseLearnTime.do",
        k = "learn/app/clientapi/course/uploadLearnFlag.do",
        C = "learn/app/clientapi/course/courseRating.do",
        y = "/learn/app/clientapi/course/queryCourseBaseInfo.do",
        N = "learn/app/clientapi/course/clockin/validate.do",
        T =
          "/learn/app/clientapi/trainingclass/cloudschool/selectResourceRule.do",
        Z =
          "learn/app/clientapi/trainingclass/training/item/selectResourceRule.do",
        B = "learn/app/clientapi/user/isOpenHumanSocietyVas.do",
        R =
          "learn/app/clientapi/trainingclass/training/item/queryRestrictDuration.do",
        D =
          "/learn/app/clientapi/trainingclass/cloudschool/queryRestrictDuration.do",
        L =
          "/learn/app/clientapi/trainingclass/training/item/check/queryTrainingCheckByEmp.do",
        q =
          "/learn/app/clientapi/trainingclass/cloudschool/check/queryTrainingCheckByEmp.do",
        Q =
          "/learn/app/clientapi/trainingclass/training/item/getLearnSequenceCode.do",
        F = "/learn/app/clientapi/course/play/queryStatus.do",
        U = "/learn/app/clientapi/course/progress/reportLearnProgress.do",
        M = "/learn/app/clientapi/course/preview.do",
        O = "/learn/app/clientapi/course/uploadCourseCompleted.do",
        P = "/learn/app/clientapi/course/relatedResources.do",
        z = "/learn/app/clientapi/exam/courseExam/insertExamVisible.do",
        W = "/learn/app/clientapi/misc/queryVasOperation2NativeList.do",
        Y = "/learn/app/clientapi/course/recordCourseWareExamScore.do",
        G = "/learn/app/clientapi/course/cview.do",
        V = "/learn/app/clientapi/course/store/play.do",
        J = "/learn/app/clientapi/course/getTokenByCode.do",
        K = "/learn/app/clientapi/knowledgecloud/members/hasSpaceViewAuth.do",
        H = "/learn/app/clientapi/knowledgecloud/members/hasPageViewAuth.do",
        X = "/learn/app/clientapi/knowledgecloud/members/hasMapViewAuth.do",
        j = "/learn/app/clientapi/knowledgecloud/space/leftMenusAll.do",
        _ =
          "/learn/app/clientapi/knowledgecloud/members/hasMorePageViewAuth.do";
      t.Z = {
        deductCoursePeriod: (function() {
          var e = (0, o.Z)(
            r().mark(function e(t) {
              return r().wrap(function(e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        "return",
                        s.Z.post(p, t, {
                          headers: {
                            "Content-Type": "application/json;charset=UTF-8",
                            sid: c.Z.sid
                          }
                        })
                      );
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function(t) {
            return e.apply(this, arguments);
          };
        })(),
        checkFirstTimePlay: (function() {
          var e = (0, o.Z)(
            r().mark(function e(t) {
              var n;
              return r().wrap(function(e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (
                        (e.next = 2),
                        s.Z.get(A, { params: { trainingItemId: t } })
                      );
                    case 2:
                      if (0 !== (n = e.sent).code) {
                        e.next = 5;
                        break;
                      }
                      return e.abrupt("return", n.body);
                    case 5:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function(t) {
            return e.apply(this, arguments);
          };
        })(),
        queryCourseDetail: function(e, t) {
          return s.Z.post(g, { courseId: e, trainingItemId: t, ver: m.dM.VER });
        },
        queryBoughtCourseDetail: function(e) {
          return s.Z.post(f, { courseId: e });
        },
        getHeadComments: function(e) {
          return s.Z.post(h, { courseId: e, type: 0 });
        },
        submitCourseRate: function(e, t) {
          return s.Z.get(C, { params: { courseId: e, rating: t } });
        },
        getComments: function(e, t) {
          return s.Z.post(v, {
            courseId: e,
            type: 0,
            curPage: t,
            numPerPage: 30
          });
        },
        markLike: function(e) {
          return s.Z.post(E, { likeType: 1, id: e, ver: m.dM.VER });
        },
        getMoreSubComments: function(e, t) {
          return s.Z.get(w, {
            params: { commentId: e, curPage: t, numPerPage: 50 }
          });
        },
        submitComment: function(e, t, n, a, i) {
          return s.Z.post(x, {
            courseId: e,
            comment: t,
            type: n,
            criticsBy: a,
            parentCommentId: i
          });
        },
        getCourseBaseInfo: function(e) {
          return s.Z.get(y, {
            params: { courseId: e },
            headers: { sid: c.Z.getSid() }
          });
        },
        updateLearnTime: function(e, t, n, a, i, r) {
          var o = a - n;
          o = o > 6e4 ? 6e4 : o;
          var c = (u().get("sessionInfo") || {}).userId,
            l = void 0 === c ? "" : c;
          return s.Z.post(b, {
            courseId: e,
            coursewareId: t,
            startTime: n,
            endTime: a,
            duration: o,
            userId: l,
            trainingItemId: i,
            learnSessionId: r,
            terminalChannel: m.dM.TERMINAL_CHANNEL
          });
        },
        updateLearnTimeV2: function(e, t, n, a, i, r, o) {
          var l = a - n;
          l = l > 6e4 ? 6e4 : l;
          var d = (u().get("sessionInfo") || {}).userId,
            p = void 0 === d ? "" : d;
          return s.Z.post(
            S,
            {
              courseId: e,
              coursewareId: t,
              startTime: n,
              endTime: a,
              duration: l,
              userId: p,
              trainingItemId: i,
              learnSessionId: r,
              terminalChannel: m.dM.TERMINAL_CHANNEL,
              firstPlay: o
            },
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                sid: c.Z.getSid()
              }
            }
          );
        },
        markCourseFinish: function(e, t) {
          return s.Z.post(k, { courseId: e, trainingItemId: t });
        },
        beforeCourseLearnTime: function(e, t) {
          return s.Z.post(I, { courseId: e, coursewareId: t });
        },
        uploadCourseCompleted: function(e, t) {
          return s.Z.post(
            O,
            { duration: e, courseId: t },
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                sid: c.Z.sid
              }
            }
          );
        },
        courseValidate: function(e) {
          return s.Z.post(N, e, {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              sid: c.Z.sid
            }
          });
        },
        selectResourceRule: function(e, t, n, a) {
          return s.Z.get(a ? T : Z, {
            params: { resourceId: e, resourceType: t, trainingItemId: n }
          });
        },
        getIsOpenHumanSocietyVas: function() {
          return s.Z.get(B, {});
        },
        queryRestrictDuration: function(e, t) {
          return s.Z.get(t ? D : R, { params: { trainingItemId: e } });
        },
        getScreenShotInfo: function(e) {
          return d.Z.post(
            "/learn/app/clientapi/screenShot/queryScreenShotInfo.do",
            (0, a.Z)({ userId: c.Z.userId }, e)
          );
        },
        getSpecialCheckId: function(e, t, n, a, i) {
          return s.Z.get(i ? q : L, {
            params: {
              resourceId: e,
              resourceType: t,
              trainingItemId: n,
              checkItemEndTag: a
            }
          });
        },
        getLearnSequenceCode: function(e, t, n) {
          return s.Z.get(Q, {
            params: { trainingItemId: e, resourceId: t, resourceType: n }
          });
        },
        queryCourseStatus: function(e) {
          return s.Z.get(F, { params: e });
        },
        reportLearnProgress: function(e) {
          return s.Z.post(
            U,
            (0, a.Z)((0, a.Z)({}, e), {}, { enterpriseId: c.Z.enterpriseId }),
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                sid: c.Z.sid
              }
            }
          );
        },
        getCoursePlayUrl: function(e) {
          return s.Z.get(M, { params: { coursewareId: e } });
        },
        getAssociationTest: function(e, t) {
          return s.Z.get(P, { params: { courseId: e, type: t } });
        },
        getInsertExamVisible: function(e, t) {
          return s.Z.get(z, { params: { examId: e, courseId: t } });
        },
        queryVasOperation2NativeList: function(e) {
          return s.Z.get(W, { params: e });
        },
        getCoursePointPopup: function(e) {
          return s.Z.get("/learn/app/clientapi/point/getCoursePointPopup.do", {
            params: e
          });
        },
        recordCourseExamScoreApi: function(e) {
          return s.Z.post(
            Y,
            (0, a.Z)((0, a.Z)({}, e), {}, { enterpriseId: c.Z.enterpriseId }),
            {
              headers: {
                "Content-Type": "application/json;charset=UTF-8",
                sid: c.Z.sid
              }
            }
          );
        },
        getTokenApi: function(e) {
          return s.Z.get(J, { params: e });
        },
        getEnterprisePlayUrl: function(e, t) {
          return s.Z.get(G, {
            params: { coursewareId: e, courseid: t, isJson: 1 }
          });
        },
        getShopPlayUrl: function(e, t) {
          return s.Z.get(V, {
            params: { storeCoursewareId: e, storeCourseId: t, isJson: 1 }
          });
        },
        hasSpaceViewAuth: function(e) {
          return s.Z.get(K, { params: { knowledgeSpaceId: e } });
        },
        hasPageViewAuth: function(e) {
          return s.Z.get(H, { params: { knowledgePageId: e } });
        },
        hasMapViewAuth: function(e) {
          return s.Z.get(X, { params: { mapId: e } });
        },
        getLeftMenu: function(e) {
          return s.Z.get(j, { params: { spaceId: e, isFirstLevel: 1 } });
        },
        hasMorePageViewAuth: function(e) {
          return s.Z.get(_, { params: { knowledgePageId: e } });
        }
      };
    },
    91205: function(e, t, n) {
      "use strict";
      n.d(t, {
        d: function() {
          return c;
        },
        H: function() {
          return l;
        }
      });
      var a = n(84322),
        i = n.n(a),
        r = n(33032),
        o = n(83057),
        s = (function() {
          var e = (0, r.Z)(
            i().mark(function e(t, n, a, r, s) {
              var c;
              return i().wrap(function(e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (e.next = 2), o.Z.getSpecialCheckId(t, n, a, 1, s);
                    case 2:
                      (c = e.sent) &&
                        0 === c.code &&
                        "function" === typeof r &&
                        r(c.body.isEnd);
                    case 4:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function(t, n, a, i, r) {
            return e.apply(this, arguments);
          };
        })(),
        c = function(e, t) {
          var n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : "",
            a = arguments.length > 3 ? arguments[3] : void 0,
            i = arguments.length > 4 ? arguments[4] : void 0;
          return (
            s(e, t, n, a, i),
            setInterval(function() {
              s(e, t, n, a, i);
            }, 3e4)
          );
        },
        l = function(e) {
          clearInterval(e);
        };
    },
    62152: function(e, t, n) {
      "use strict";
      n.d(t, {
        Z: function() {
          return f;
        }
      });
      var a = n(84322),
        i = n.n(a),
        r = n(33032),
        o = n(20042),
        s = n(67294),
        c = n.n(s),
        l = n(52543),
        u = n(20849),
        m = n(87623),
        d = n(37200),
        p = n(87027),
        A = n(63340),
        g = n(69134),
        f = (0, l.Z)(function(e) {
          return (0,
          m.Z)({ certificateBox: { height: 500, padding: "50px 0 62px", position: "relative" }, certificateImg: { height: 400, margin: "0 auto 40px", display: "block" }, certificateBut: { width: 230, height: 48, background: e.palette.primary.main, margin: "0 auto", fontSize: 18, position: "absolute", left: 0, right: 0, bottom: 64 } });
        })(function(e) {
          var t = e.classes,
            a = e.setExamStage,
            l = e.examId,
            m = e.getExamBreakInfo,
            f = e.changeLoading,
            h = e.isFromResult,
            v = (0, s.useState)(""),
            E = (0, o.Z)(v, 2),
            x = E[0],
            w = E[1],
            I = (0, s.useState)(!1),
            b = (0, o.Z)(I, 2),
            S = b[0],
            k = b[1];
          (0, s.useEffect)(function() {
            f(!0), C();
          }, []);
          var C = (function() {
            var e = (0, r.Z)(
              i().mark(function e() {
                var t;
                return i().wrap(
                  function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (e.prev = 0),
                            (e.next = 3),
                            u.Oe.queryExamCertificate(l)
                          );
                        case 3:
                          if (
                            ((t = e.sent),
                            k(!0),
                            setTimeout(function() {
                              f(!1);
                            }, 2e3),
                            !t._failure)
                          ) {
                            e.next = 8;
                            break;
                          }
                          return e.abrupt("return");
                        case 8:
                          t.body && 0 === +t.code && w(t.body), (e.next = 16);
                          break;
                        case 11:
                          (e.prev = 11),
                            (e.t0 = e.catch(0)),
                            k(!0),
                            n.g.$message((0, g.vs)("network_anomaly")),
                            f(!1);
                        case 16:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [[0, 11]]
                );
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })();
          return c().createElement(
            "div",
            {
              className: t.certificateBox,
              style: { height: "".concat(!x && S ? "400px" : "500px") }
            },
            !!x &&
              S &&
              c().createElement("img", {
                src: "".concat(x),
                alt: "",
                className: t.certificateImg
              }),
            !x &&
              S &&
              c().createElement(A.Z, {
                height: "300px",
                bottomText: (0, g.vs)("no_data_yet")
              }),
            c().createElement(
              p.Z,
              {
                loading: !1,
                className: t.certificateBut,
                onClick: function() {
                  h ? a(d.Bc.result) : (a(d.Bc.info), m(!1));
                }
              },
              (0, g.vs)("back")
            )
          );
        });
    },
    41603: function(e, t, n) {
      "use strict";
      var a = n(84322),
        i = n.n(a),
        r = n(18489),
        o = n(33032),
        s = n(20042),
        c = n(67294),
        l = n.n(c),
        u = n(52543),
        m = n(37200),
        d = n(20849),
        p = n(91914),
        A = n(87027),
        g = n(33774),
        f = n(58085),
        h = n(63340),
        v = n(69134);
      t.Z = (0, u.Z)(p.Z)(function(e) {
        var t = e.classes,
          n = e.examId,
          a = e.setExamStage,
          u = e.examPaper,
          p = e.isFromResult,
          E = e.MAX_QUESTION_NUM,
          x = e.detail,
          w = e.getExamBreakInfo,
          I = (0, c.useState)([]),
          b = (0, s.Z)(I, 2),
          S = b[0],
          k = b[1],
          C = (0, c.useState)([]),
          y = (0, s.Z)(C, 2),
          N = (y[0], y[1]),
          T = (0, c.useState)(0),
          Z = (0, s.Z)(T, 2),
          B = Z[0],
          R = Z[1],
          D = (0, c.useState)(!1),
          L = (0, s.Z)(D, 2),
          q = L[0],
          Q = L[1],
          F = (0, c.useState)([[]]),
          U = (0, s.Z)(F, 2),
          M = U[0],
          O = U[1];
        (0, c.useEffect)(function() {
          p ? P() : Y();
        }, []);
        var P = (function() {
            var e = (0, o.Z)(
              i().mark(function e() {
                var t, a, o, s;
                return i().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          Q(!0),
                          (e.next = 3),
                          d.Oe.queryErrorQuestionListByAttemptId(n, u.attemptId)
                        );
                      case 3:
                        if (!(t = e.sent)._failure) {
                          e.next = 7;
                          break;
                        }
                        return Q(!1), e.abrupt("return");
                      case 7:
                        if (
                          ((a = (t.body || []).map(function(e) {
                            return {
                              questionId: e.questionId,
                              questionNodeIds: e.questionNodesAnswer
                            };
                          })),
                          N(a),
                          !(0 === +t.code && (t.body || []).length > 0))
                        ) {
                          e.next = 15;
                          break;
                        }
                        return (
                          (o = t.body.map(function(e) {
                            return e.questionId;
                          })),
                          (s = t.body.map(function(e, t) {
                            return (0, r.Z)(
                              (0, r.Z)({}, e),
                              {},
                              {
                                questionNo: t + 1,
                                myAnswer: e.answerList || [],
                                sortNo: t + 1,
                                myAnswerList: e.questionNodesAnswer.map(
                                  function(e, t) {
                                    return (0, r.Z)(
                                      (0, r.Z)({}, e),
                                      {},
                                      {
                                        questionNo: t + 1,
                                        answerList: e.answerList || []
                                      }
                                    );
                                  }
                                )
                              }
                            );
                          })),
                          k(s),
                          (e.next = 15),
                          G(o, a)
                        );
                      case 15:
                        Q(!1);
                      case 16:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })(),
          z = function e(t, n) {
            return (
              t.forEach(function(t) {
                n.push(t.questionId),
                  t.questionNodeIds &&
                    t.questionNodeIds.length > 0 &&
                    e(t.questionNodeIds, n);
              }),
              n
            );
          },
          W = function(e, t) {
            var n = [];
            return (
              (t && t.length > 0 ? t : u.questionNodeResp).forEach(function(t) {
                e.includes(t.questionId) && z(t.questionNodeIds, n);
              }),
              { questionIds: e, questionNodeIds: n }
            );
          },
          Y = (function() {
            var e = (0, o.Z)(
              i().mark(function e() {
                var t, a, o;
                return i().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          Q(!0),
                          (e.next = 3),
                          d.Oe.queryErrorQuestionListByExamId(n)
                        );
                      case 3:
                        if (!(t = e.sent)._failure) {
                          e.next = 7;
                          break;
                        }
                        return Q(!1), e.abrupt("return");
                      case 7:
                        if (
                          (N(t.body || []),
                          !(0 === +t.code && t.body && t.body.length > 0))
                        ) {
                          e.next = 14;
                          break;
                        }
                        return (
                          (a = t.body.map(function(e) {
                            return e.questionId;
                          })),
                          (o = t.body.map(function(e, t) {
                            return {
                              questionId: e.questionId,
                              questionNo: t + 1,
                              answerList: [],
                              sortNo: t + 1,
                              myAnswerList:
                                ((n = e.questionNodesAnswer),
                                n && n.length
                                  ? n.map(function(e, t) {
                                      return {
                                        answerList: [],
                                        questionNo: t + 1,
                                        questionId: e
                                      };
                                    })
                                  : [])
                            };
                            var n;
                          })),
                          k(
                            o.map(function(e) {
                              return (0,
                              r.Z)((0, r.Z)({}, e), {}, { question: {} });
                            })
                          ),
                          (e.next = 14),
                          G(a, t.body)
                        );
                      case 14:
                        Q(!1);
                      case 15:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })(),
          G = (function() {
            var e = (0, o.Z)(
              i().mark(function e(t, n) {
                var a;
                return i().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (a = [V(t, n)]), (e.next = 3), Promise.all(a);
                      case 3:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function(t, n) {
              return e.apply(this, arguments);
            };
          })(),
          V = (function() {
            var e = (0, o.Z)(
              i().mark(function e(t, n) {
                var a;
                return i().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (!(t.length > E)) {
                          e.next = 6;
                          break;
                        }
                        return (a = J(t)), (e.next = 4), K(a[0], n);
                      case 4:
                        e.next = 8;
                        break;
                      case 6:
                        return (e.next = 8), K(t, n);
                      case 8:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function(t, n) {
              return e.apply(this, arguments);
            };
          })(),
          J = function(e) {
            var t = [];
            if (e && e.length > E) {
              for (var n = 0; n < e.length; n += E) t.push(e.slice(n, n + E));
              O(t);
            }
            return t;
          },
          K = (function() {
            var e = (0, o.Z)(
              i().mark(function e(t, a) {
                var o, s, c;
                return i().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (o = W(t, a)),
                          (s = o.questionNodeIds),
                          (e.next = 3),
                          d.Oe.queryQuestionDetail(n, t, s)
                        );
                      case 3:
                        if (!(c = e.sent)._failure) {
                          e.next = 6;
                          break;
                        }
                        return e.abrupt("return", !1);
                      case 6:
                        if (0 !== +c.code || !c.body) {
                          e.next = 10;
                          break;
                        }
                        return (
                          console.log(c.body),
                          k(function(e) {
                            return e.map(function(e) {
                              var t = c.body.find(function(t) {
                                return t.questionId === e.questionId;
                              });
                              return t
                                ? (0, r.Z)(
                                    (0, r.Z)((0, r.Z)({}, e), t),
                                    {},
                                    { question: (0, r.Z)({}, t) }
                                  )
                                : e;
                            });
                          }),
                          e.abrupt("return", c.body)
                        );
                      case 10:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function(t, n) {
              return e.apply(this, arguments);
            };
          })(),
          H = S[B] || {},
          X = (function() {
            var e = (0, o.Z)(
              i().mark(function e(t, n) {
                var a;
                return i().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (S[t].questionText) {
                          e.next = 6;
                          break;
                        }
                        return (
                          Q(!0),
                          (a = M.findIndex(function(e) {
                            return e.find(function(e) {
                              return e === S[t].questionId;
                            });
                          })),
                          (e.next = 5),
                          K(M[a > -1 ? a : 0])
                        );
                      case 5:
                        Q(!1);
                      case 6:
                        "function" === typeof n && n();
                      case 7:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function(t, n) {
              return e.apply(this, arguments);
            };
          })();
        if (q) return l().createElement(f.Z, null);
        return l().createElement(
          l().Fragment,
          null,
          l().createElement(
            "div",
            {
              className: t.goback,
              onClick: function() {
                p ? a(m.Bc.result) : (a(m.Bc.info), w(!1));
              }
            },
            "< ",
            (0, v.vs)("back")
          ),
          S.length > 0
            ? l().createElement(
                l().Fragment,
                null,
                l().createElement(
                  "div",
                  { className: t.top },
                  l().createElement(
                    "div",
                    { className: t.topLeft },
                    l().createElement(
                      "div",
                      { className: t.subjectNum },
                      l().createElement(
                        "span",
                        { className: t.currentSubject },
                        B + 1
                      ),
                      l().createElement(
                        "span",
                        { className: t.totalSubject },
                        "/",
                        S.length
                      )
                    ),
                    l().createElement(
                      "div",
                      { className: t.subjectType },
                      m.tX[H.questionType || ""]
                    )
                  )
                ),
                l().createElement(g.Z, {
                  isViewErrorQuestions: !0,
                  isFromResult: p,
                  currentIndex: B,
                  currentSubject: H,
                  detail: x
                }),
                S &&
                  S.length > 1 &&
                  l().createElement(
                    "div",
                    { className: t.manipulate },
                    0 === B &&
                      l().createElement(
                        "div",
                        { className: t.buttonDisabled },
                        (0, v.vs)("examDetail_previous")
                      ),
                    0 !== B &&
                      l().createElement(
                        A.Z,
                        {
                          loading: !1,
                          className: t.manipulateBtn,
                          onClick: function() {
                            X(B - 1, function() {
                              return R(B - 1);
                            });
                          }
                        },
                        (0, v.vs)("examDetail_previous")
                      ),
                    B !== S.length - 1 &&
                      l().createElement(
                        A.Z,
                        {
                          loading: !1,
                          className: ""
                            .concat(t.manipulateBtn, " ")
                            .concat(t.next),
                          onClick: function() {
                            X(B + 1, function() {
                              return R(B + 1);
                            });
                          }
                        },
                        (0, v.vs)("examDetail_next")
                      ),
                    B === S.length - 1 &&
                      l().createElement(
                        "div",
                        {
                          className: ""
                            .concat(t.buttonDisabled, " ")
                            .concat(t.next)
                        },
                        (0, v.vs)("examDetail_next")
                      )
                  )
              )
            : l().createElement(h.Z, {
                height: "600px",
                bottomText: (0, v.vs)("examDetail_no_mistake")
              })
        );
      });
    },
    55979: function(e, t, n) {
      "use strict";
      n.d(t, {
        Z: function() {
          return te;
        }
      });
      var a = n(52470),
        i = n(65658),
        r = n(18489),
        o = n(84322),
        s = n.n(o),
        c = n(33032),
        l = n(20042),
        u = n(67294),
        m = n.n(u),
        d = n(26709),
        p = n(30553),
        A = n(13258),
        g = n(16218),
        f = n(59816),
        h = n(52543),
        v = n(96486),
        E = n(37200),
        x = n(20849),
        w = n(91914),
        I = n(87027),
        b = n(66045),
        S = n(89472),
        k = n(91155),
        C = n(256),
        y = n(69134);
      var N,
        T,
        Z,
        B,
        R,
        D,
        L = (0, h.Z)(C.Z)(function(e) {
          var t = e.classes,
            n = e.visible,
            a = e.closeDialog,
            i = e.setCurrentIndex,
            r = e.questionAnswers,
            o = e.submitExam,
            d = e.onChangeQuestionNo,
            p = e.timeLimitState,
            A = (0, u.useState)(!1),
            g = (0, l.Z)(A, 2),
            f = g[0],
            h = g[1],
            v = (0, u.useState)(!1),
            x = (0, l.Z)(v, 2),
            w = x[0],
            I = x[1],
            C = (0, u.useState)(!1),
            N = (0, l.Z)(C, 2),
            T = N[0],
            Z = N[1],
            B = (0, u.useState)([]),
            R = (0, l.Z)(B, 2),
            D = R[0],
            L = R[1],
            q = (0, u.useState)([]),
            Q = (0, l.Z)(q, 2),
            F = Q[0],
            U = Q[1];
          (0, u.useEffect)(
            function() {
              O();
            },
            [r]
          );
          var M = function(e, t) {
              if (t.length) return !0;
              if (e.length < 1) return !1;
              var n,
                a = 0,
                i = (0, S.Z)(e);
              try {
                for (i.s(); !(n = i.n()).done; ) {
                  n.value || a++;
                }
              } catch (r) {
                i.e(r);
              } finally {
                i.f();
              }
              return a !== e.length;
            },
            O = function() {
              var e = [],
                t = [];
              r.map(function(n) {
                p
                  ? n.done
                    ? t.push(n)
                    : e.push(n)
                  : !(function(e) {
                      var t = e.answerList,
                        n = e.questionNodesAnswer,
                        a = void 0 === n ? [] : n,
                        i = e.images,
                        r = void 0 === i ? [] : i,
                        o = a.length;
                      return a && a.length
                        ? o >
                            a.filter(function(e) {
                              return e.questionNodesAnswer &&
                                e.questionNodesAnswer.length
                                ? e.questionNodesAnswer.every(function(e) {
                                    return M(e.answerList || [], r);
                                  })
                                : M(e.answerList, r);
                            }).length
                        : !M(t, r);
                    })(n)
                  ? t.push(n)
                  : e.push(n);
              }),
                L(t),
                U(e),
                r && e && e.length > 0 ? Z(!0) : Z(!1);
            },
            P = function(e, t) {
              (t && "no" === t && p) ||
                (a(),
                d(
                  e - 1,
                  function() {
                    i(e - 1);
                  },
                  "end"
                ));
            },
            z = function() {
              a(), h(!0);
            },
            W = function() {
              a(), p || (F && F[0] && F[0].questionNo && P(F[0].questionNo));
            },
            Y = (function() {
              var e = (0, c.Z)(
                s().mark(function e() {
                  return s().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return I(!0), (e.next = 3), o(E.Bc.result, "end");
                        case 3:
                          I(!1), h(!1);
                        case 5:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })(),
            G = m().createElement(
              m().Fragment,
              null,
              m().createElement(
                "h5",
                { className: t.dialogTitle },
                (0, y.vs)("examDetail_exam_total", {
                  total: F.length + D.length
                })
              ),
              m().createElement(
                "div",
                { className: t.dialogContent },
                m().createElement(
                  "div",
                  null,
                  m().createElement(
                    "p",
                    { className: t.numberTitle },
                    (0, y.vs)("examDetail_not_answer"),
                    F.length
                  ),
                  m().createElement(
                    "ul",
                    { className: t.numberUl },
                    F &&
                      F.map(function(e, n) {
                        return m().createElement(
                          "li",
                          {
                            className: t.numberNo,
                            key: e.questionId,
                            onClick: function() {
                              return P(e.questionNo || 0, "no");
                            },
                            style: { cursor: p ? "default" : "pointer" }
                          },
                          e.questionNo
                        );
                      })
                  )
                ),
                m().createElement(
                  "div",
                  {
                    style: { marginTop: "".concat(0 === F.length ? "20px" : 0) }
                  },
                  m().createElement(
                    "p",
                    {
                      className: ""
                        .concat(t.numberTitle, " ")
                        .concat(F.length ? "".concat(t.numberTitleMargin) : "")
                    },
                    (0, y.vs)("examDetail_answered"),
                    D.length
                  ),
                  m().createElement(
                    "ul",
                    { className: t.numberUl },
                    D &&
                      D.map(function(e, n) {
                        return m().createElement(
                          "li",
                          {
                            className: ""
                              .concat(t.numberNo, " ")
                              .concat(t.numberYes),
                            key: e.questionId,
                            onClick: function() {
                              return P(e.questionNo || 0, "yes");
                            }
                          },
                          e.questionNo
                        );
                      })
                  )
                )
              )
            ),
            V = T
              ? m().createElement(
                  "div",
                  { className: t.twoContent },
                  (0, y.vs)("examDetail_hasNoAnswer", {
                    questionAnswers: r.length,
                    yesArr: D.length,
                    noArr: F.length
                  })
                )
              : m().createElement(
                  "div",
                  { className: t.twoContent },
                  (0, y.vs)("examDetail_all_complete", {
                    questionAnswers: r.length
                  })
                );
          return m().createElement(
            m().Fragment,
            null,
            m().createElement(b.Z, {
              onCancel: function() {
                T ? z() : W();
              },
              onOk: function() {
                T ? W() : z();
              },
              visible: n,
              content: G,
              confirmAndCancel: !0,
              classes: { paper: (0, k.w1)() ? t.paperIe : t.paper },
              okText: T
                ? (0, y.vs)("examDetail_go_back_continue")
                : (0, y.vs)("examDetail_submit_exam_page"),
              cancelText: T
                ? (0, y.vs)("examDetail_submit_exam_page")
                : (0, y.vs)("cancel")
            }),
            m().createElement(b.Z, {
              loading: w,
              onCancel: function() {
                F && F[0] && F[0].questionNo && P(F[0].questionNo),
                  w && I(!1),
                  h(!1);
              },
              onOk: Y,
              visible: f,
              content: V,
              confirmAndCancel: !0,
              classes: { paper: t.twoPaper },
              okText: (0, y.vs)("examDetail_submit_exam_page"),
              cancelText: (0, y.vs)("cancel")
            })
          );
        }),
        q = n(60722),
        Q = n(46327),
        F = n(33774),
        U = (0, h.Z)({
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
        })(function(e) {
          var t = e.classes,
            n = e.remainTime,
            a = e.countTimeEnd,
            i = (0, u.useState)(n > 0 ? n : 0),
            r = (0, l.Z)(i, 2),
            o = r[0],
            s = r[1];
          (0, u.useEffect)(
            function() {
              ((T = n), n > 0) ? c() : a(n < -600);
              return function() {
                clearInterval(N);
              };
            },
            [n]
          );
          var c = function() {
              N = setInterval(function() {
                T > 0
                  ? (s(function(e) {
                      return e - 1;
                    }),
                    T--)
                  : (clearInterval(N), a(!1));
              }, 1e3);
            },
            d = function(e) {
              return e < 10 ? "0".concat(e) : e;
            },
            p = function(e) {
              var t = Math.floor(e / 3600),
                n = Math.floor((e / 60) % 60),
                a = e % 60;
              return ""
                .concat(d(t), ":")
                .concat(d(n), ":")
                .concat(d(a));
            };
          return n <= 0
            ? m().createElement(
                "div",
                { className: t.remainTime },
                (0, y.vs)("examDetail_remaining_time"),
                p(0)
              )
            : m().createElement(
                "div",
                { className: t.remainTime },
                (0, y.vs)("examDetail_remaining_time"),
                p(o)
              );
        }),
        M = n(64229),
        O = (0, h.Z)(M.Z)(function(e) {
          var t = e.classes,
            n = e.questionNum,
            a = e.autoSubmitExam,
            i = e.networkState,
            r = (0, u.useState)(5),
            o = (0, l.Z)(r, 2),
            s = o[0],
            c = o[1];
          (0, u.useEffect)(function() {
            var e = Math.floor(5 * Math.random()) + 5;
            return (
              (B = e),
              d(),
              function() {
                clearInterval(Z);
              }
            );
          }, []);
          var d = function() {
              c(function() {
                return B;
              }),
                (Z = setInterval(function() {
                  B > 0
                    ? (c(function(e) {
                        return e - 1;
                      }),
                      B--)
                    : (a(), clearInterval(Z));
                }, 1e3));
            },
            p = m().createElement(
              "div",
              { className: t.ManipulateDialogContent },
              (0, y.vs)("examDetail_time_over", { questionNum: n })
            );
          return m().createElement(
            m().Fragment,
            null,
            m().createElement(b.Z, {
              onOk: a,
              visible: !0,
              userClose: !0,
              content: p,
              okText: (0, y.vs)("examDetail_continue_submit", { time: s }),
              networkState: i
            })
          );
        }),
        P = n(91205),
        z = n(50124),
        W = ["questionIdList", "questionNodeResp"],
        Y = [],
        G = !0,
        V = [],
        J = 0,
        K = 0,
        H = !1,
        X = !1,
        j = 0,
        _ = 1,
        $ = !1,
        ee = !1,
        te = (0, h.Z)(w.Z)(function(e) {
          var t = e.classes,
            o = e.examPaper,
            h = e.answers,
            w = e.questionDetails,
            S = e.remainTime,
            C = e.isInvigilate,
            N = e.setExamStage,
            T = e.setExamPaper,
            Z = e.setExamResultObj,
            B = e.setAllAnswers,
            M = e.onChangeQuestionNo,
            te = e.currentIndex,
            ne = e.setCurrentIndex,
            ae = e.isFromResult,
            ie = e.detail,
            re = e.setRemainTime,
            oe = e.getExamBreakInfo,
            se = e.loadingState,
            ce = e.examId,
            le = e.trainingItemId,
            ue = e.limitSize,
            me = e.cutScreenInfo,
            de = (0, u.useState)(!1),
            pe = (0, l.Z)(de, 2),
            Ae = pe[0],
            ge = pe[1],
            fe = (0, u.useState)([]),
            he = (0, l.Z)(fe, 2),
            ve = he[0],
            Ee = he[1],
            xe = (0, u.useState)(!1),
            we = (0, l.Z)(xe, 2),
            Ie = we[0],
            be = we[1],
            Se = (0, u.useState)(!1),
            ke = (0, l.Z)(Se, 2),
            Ce = ke[0],
            ye = ke[1],
            Ne = (0, u.useState)(!1),
            Te = (0, l.Z)(Ne, 2),
            Ze = Te[0],
            Be = Te[1],
            Re = (0, u.useState)(0),
            De = (0, l.Z)(Re, 2),
            Le = De[0],
            qe = De[1],
            Qe = (0, u.useState)(0),
            Fe = (0, l.Z)(Qe, 2),
            Ue = Fe[0],
            Me = Fe[1],
            Oe = (0, u.useState)(!1),
            Pe = (0, l.Z)(Oe, 2),
            ze = Pe[0],
            We = Pe[1],
            Ye = (0, u.useState)(!1),
            Ge = (0, l.Z)(Ye, 2),
            Ve = Ge[0],
            Je = Ge[1],
            Ke = (0, u.useState)(!1),
            He = (0, l.Z)(Ke, 2),
            Xe = He[0],
            je = He[1],
            _e = (0, u.useState)(!1),
            $e = (0, l.Z)(_e, 2),
            et = $e[0],
            tt = $e[1],
            nt = (0, u.useState)(!1),
            at = (0, l.Z)(nt, 2),
            it = at[0],
            rt = at[1],
            ot = (0, u.useState)(""),
            st = (0, l.Z)(ot, 2),
            ct = st[0],
            lt = st[1],
            ut = (0, u.useState)((0, y.vs)("confirm")),
            mt = (0, l.Z)(ut, 2),
            dt = mt[0],
            pt = mt[1],
            At = (0, u.useState)(!1),
            gt = (0, l.Z)(At, 2),
            ft = gt[0],
            ht = gt[1],
            vt = (0, u.useState)(Object),
            Et = (0, l.Z)(vt, 2),
            xt = Et[0],
            wt = Et[1],
            It = (0, u.useState)(!1),
            bt = (0, l.Z)(It, 2),
            St = bt[0],
            kt = bt[1],
            Ct = (0, u.useState)(!1),
            yt = (0, l.Z)(Ct, 2),
            Nt = yt[0],
            Tt = yt[1],
            Zt = (0, u.useState)(!1),
            Bt = (0, l.Z)(Zt, 2),
            Rt = Bt[0],
            Dt = Bt[1],
            Lt = (0, u.useState)(0),
            qt = (0, l.Z)(Lt, 2),
            Qt = qt[0],
            Ft = qt[1],
            Ut = (0, d.k6)(),
            Mt = se.nextLoading,
            Ot = se.upLoading,
            Pt = se.questionLoading,
            zt = se.setTypeLoding;
          (0, u.useEffect)(
            function() {
              var e;
              return (
                o.examId && (e = (0, P.d)(ce, 30, le, mn)),
                (window.onbeforeunload = function() {
                  (0, P.H)(e);
                }),
                function() {
                  (0, P.H)(e);
                }
              );
            },
            [o]
          ),
            (0, u.useEffect)(
              function() {
                (K = te), te > J && (J = te);
              },
              [te]
            ),
            (0, u.useEffect)(
              function() {
                H = ze;
              },
              [ze]
            ),
            (0, u.useEffect)(
              function() {
                X = et;
              },
              [et]
            ),
            (0, u.useEffect)(function() {
              return (
                (G = !0),
                (D = 0),
                (V = []),
                (J = 0),
                (K = 0),
                function() {
                  ie &&
                    ie.isTimeLimit === E.hn.YES &&
                    ((V = []), (J = 0), (K = 0), R && ((D = 0), sn()));
                }
              );
            }, []),
            (0, u.useEffect)(
              function() {
                V = h;
              },
              [h]
            ),
            (0, u.useEffect)(
              function() {
                ie && ie.isTimeLimit === E.hn.YES && Be(!0);
              },
              [ie]
            ),
            (0, u.useEffect)(
              function() {
                if (
                  ie &&
                  ie.isTimeLimit === E.hn.YES &&
                  w &&
                  w[te] &&
                  w[te].question &&
                  w[te].question.questionType &&
                  V &&
                  V[te] &&
                  !V[te].done
                ) {
                  var e = w[te].question.questionType;
                  rn(e);
                }
              },
              [ie, w, te]
            ),
            (0, u.useEffect)(
              function() {
                (Y = []),
                  C &&
                    o.questionIdList &&
                    (Yt(o.questionIdList.length),
                    setTimeout(function() {
                      webcam.capture();
                    }, 3e3));
              },
              [o]
            ),
            (0, u.useEffect)(
              function() {
                !(function() {
                  if (S.remainSeconds) {
                    var e = S.remainSeconds,
                      t = ie.autoSubmitDate,
                      n = ie.isAutoSubmit,
                      a = new Date(t).getTime() - new Date().getTime(),
                      i = Math.floor(a / 1e3),
                      r = n && i < e ? i : e;
                    if (r <= 0 && n) return void nn(!1);
                    Ft(r);
                  }
                })();
              },
              [ie, S]
            );
          var Wt = (function() {
            var e = (0, c.Z)(
              s().mark(function e(t) {
                var n, a, i;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (n = (0, k.xG)()),
                          (a = {
                            businessType: E.$8.Exam,
                            resourceId: t,
                            userId: n.sessionInfo && n.sessionInfo.userId
                          }),
                          (e.next = 4),
                          x.Oe.reportOnScreen(a)
                        );
                      case 4:
                        if (((i = e.sent), ($ = !0), 0 === +i.code)) {
                          e.next = 8;
                          break;
                        }
                        return e.abrupt("return");
                      case 8:
                        wt(i.body), (_ = i.body.remainderTimes), ht(!0);
                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function(t) {
              return e.apply(this, arguments);
            };
          })();
          (0, u.useEffect)(
            function() {
              var e =
                  window.outerWidth + 10 >= screen.availWidth &&
                  window.outerHeight + 10 >= screen.availHeight,
                t = window.navigator.userAgent.toLocaleLowerCase(),
                n = t.indexOf("wxwork") > -1,
                a = Number(t.split("chrome/")[1].split(".")[0]);
              if (
                (t.includes("mac") &&
                  t.includes("chrome") &&
                  a > 110 &&
                  (e = !0),
                n && (e = !0),
                (_ = 1),
                !ie || ie.isFlipScreen === E.iK.Open)
              )
                return me && me.maxTimes
                  ? (kt(!0),
                    e || Dt(!0),
                    (window.onblur = function() {
                      (j = Date.now()), (ee = !1);
                    }),
                    (window.onfocus = function() {
                      var e =
                          window.outerWidth + 10 >= screen.availWidth &&
                          window.outerHeight + 10 >= screen.availHeight,
                        t = window.navigator.userAgent.toLocaleLowerCase(),
                        n = t.indexOf("wxwork") > -1,
                        a = Number(t.split("chrome/")[1].split(".")[0]);
                      if (
                        (t.includes("mac") &&
                          t.includes("chrome") &&
                          a > 110 &&
                          (e = !0),
                        n && (e = !0),
                        e)
                      ) {
                        if (ee) return;
                        if (Date.now() - j <= 2e3) return;
                        Tt(!1), Dt(!1), Wt(ce);
                      } else {
                        if (0 === _) return;
                        Dt(!0), Tt(!0), kt(!1), Wt(ce), (ee = !0);
                      }
                    }),
                    void (window.onresize = function() {
                      var e =
                          window.outerWidth + 10 >= screen.availWidth &&
                          window.outerHeight + 10 >= screen.availHeight,
                        t = window.navigator.userAgent.toLocaleLowerCase(),
                        n = t.indexOf("wxwork") > -1,
                        a = Number(t.split("chrome/")[1].split(".")[0]);
                      if (
                        (t.includes("mac") &&
                          t.includes("chrome") &&
                          a > 110 &&
                          (e = !0),
                        n && (e = !0),
                        e)
                      )
                        Tt(!1), ($ = !1), Dt(!1);
                      else {
                        if (0 === _) return;
                        Dt(!0), Tt(!0), kt(!1), $ || Wt(ce);
                      }
                    }))
                  : void 0;
            },
            [me]
          );
          var Yt = function(e) {
              var t = [];
              if (e <= 4) {
                for (var n = V.length; n < e; n++) t.push(n);
                Ee(t);
              } else {
                t.push(Math.floor(Math.random() * e) + 1);
                for (var a = 0; a < 3; a++) {
                  for (
                    var i = Math.floor(Math.random() * e);
                    t.indexOf(i) > -1 || i <= V.length;

                  )
                    i = Math.floor(Math.random() * e);
                  t.push(i);
                }
                Ee(t);
              }
            },
            Gt = w[te] || {},
            Vt = function(e, t, n) {
              B(function(a) {
                return a.map(function(a) {
                  return (0, v.findIndex)(e, function(e) {
                    return e.questionId === a.questionId;
                  }) > -1
                    ? (0, r.Z)(
                        (0, r.Z)({}, a),
                        {},
                        { done: void 0 === n ? a.done : n, hasSubmit: t }
                      )
                    : a;
                });
              });
            },
            Jt = (function() {
              var e = (0, c.Z)(
                s().mark(function e(t, a, r, o) {
                  var c, l, u;
                  return s().wrap(
                    function(e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            if (((c = !0), (l = {}), (e.prev = 2), !r)) {
                              e.next = 9;
                              break;
                            }
                            return (e.next = 6), x.Oe.submitQuestionAnswer(t);
                          case 6:
                            (l = e.sent), (e.next = 12);
                            break;
                          case 9:
                            return (
                              (e.next = 11), x.Oe.submitQuestionAnswerNext(t)
                            );
                          case 11:
                            l = e.sent;
                          case 12:
                            (G = !0), (e.next = 20);
                            break;
                          case 15:
                            (e.prev = 15),
                              (e.t0 = e.catch(2)),
                              r ||
                                1 !== a ||
                                n.g.$message((0, y.vs)("network_anomaly")),
                              (c = !1),
                              (G = !1);
                          case 20:
                            if ((!l || (!l._failure && 0 === +l.code)) && c) {
                              e.next = 24;
                              break;
                            }
                            return (
                              (c = !0),
                              1 === a &&
                                ((Y = (0, v.uniqBy)(
                                  [].concat((0, i.Z)(Y), (0, i.Z)(t)),
                                  "questionId"
                                )),
                                Vt(t, !1)),
                              e.abrupt("return", !1)
                            );
                          case 24:
                            if (!l.body || 0 !== l.code) {
                              e.next = 28;
                              break;
                            }
                            return (
                              Vt(t, !0, !0),
                              Y.length &&
                                ((u = t.map(function(e) {
                                  return e.questionId;
                                })),
                                (Y = Y.filter(function(e) {
                                  return !u.includes(e.questionId);
                                }))),
                              e.abrupt("return", !0)
                            );
                          case 28:
                            return e.abrupt("return", !1);
                          case 29:
                          case "end":
                            return e.stop();
                        }
                    },
                    e,
                    null,
                    [[2, 15]]
                  );
                })
              );
              return function(t, n, a, i) {
                return e.apply(this, arguments);
              };
            })(),
            Kt = (function() {
              var e = (0, c.Z)(
                s().mark(function e(t, l, u, m) {
                  var d, p, A, g, f;
                  return s().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (
                            ((d = []),
                            o.questionIdList,
                            o.questionNodeResp,
                            (p = (0, a.Z)(o, W)),
                            (A = V[te]),
                            (g = 20),
                            (f = !1),
                            !l)
                          ) {
                            e.next = 15;
                            break;
                          }
                          if (
                            !(
                              (d =
                                "auto" === u
                                  ? (0, v.uniqBy)(
                                      [].concat((0, i.Z)(Y), [
                                        (0, r.Z)(
                                          (0, r.Z)({}, p),
                                          {},
                                          {
                                            answerList: A && A.answerList,
                                            questionId: Gt.questionId,
                                            images: (A && A.images) || []
                                          }
                                        )
                                      ]),
                                      "questionId"
                                    )
                                  : (0, v.uniqBy)((0, i.Z)(Y), "questionId"))
                                .length < 1
                            )
                          ) {
                            e.next = 12;
                            break;
                          }
                          return (
                            m && "function" === typeof m && m(!0),
                            e.abrupt("return", !0)
                          );
                        case 12:
                          d.length > g && ((d = d.slice(0, g)), (f = !0));
                        case 13:
                          e.next = 19;
                          break;
                        case 15:
                          if (
                            !(null === A || void 0 === A ? void 0 : A.hasSubmit)
                          ) {
                            e.next = 18;
                            break;
                          }
                          return (
                            m && "function" === typeof m && m(!0),
                            e.abrupt("return", !0)
                          );
                        case 18:
                          d = [
                            (0, r.Z)(
                              (0, r.Z)({}, p),
                              {},
                              {
                                answerList: A && A.answerList,
                                questionId: Gt.questionId,
                                questionNodesAnswer: A && A.questionNodesAnswer,
                                images: (A && A.images) || [],
                                answerList4Blank:
                                  (A && A.answerList4Blank) || []
                              }
                            )
                          ];
                        case 19:
                          return (e.next = 21), Jt(d, t, l, u);
                        case 21:
                          if (!e.sent) {
                            e.next = 33;
                            break;
                          }
                          if (!f) {
                            e.next = 31;
                            break;
                          }
                          return (
                            Y.splice(0, g),
                            (f = !1),
                            (e.next = 28),
                            Kt(3, l, u, m)
                          );
                        case 28:
                          return e.abrupt("return", e.sent);
                        case 31:
                          return (
                            m && "function" === typeof m && m(!0),
                            e.abrupt("return", !0)
                          );
                        case 33:
                          return (
                            t > 1
                              ? setTimeout(
                                  (0, c.Z)(
                                    s().mark(function e() {
                                      return s().wrap(function(e) {
                                        for (;;)
                                          switch ((e.prev = e.next)) {
                                            case 0:
                                              return (
                                                (e.next = 2), Kt(t - 1, l, u, m)
                                              );
                                            case 2:
                                              return e.abrupt("return", e.sent);
                                            case 3:
                                            case "end":
                                              return e.stop();
                                          }
                                      }, e);
                                    })
                                  ),
                                  2e3
                                )
                              : (m && "function" === typeof m && m(!1),
                                l &&
                                  n.g.$message(
                                    (0, y.vs)("examDetail_submit_failed")
                                  )),
                            e.abrupt("return", !1)
                          );
                        case 35:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function(t, n, a, i) {
                return e.apply(this, arguments);
              };
            })(),
            Ht = (function() {
              var e = (0, c.Z)(
                s().mark(function e(t) {
                  var a, i;
                  return s().wrap(
                    function(e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              C && jt(te),
                              (a = {}),
                              (e.prev = 2),
                              (e.next = 5),
                              x.Oe.submitNewExamPaper({
                                attemptId: o.attemptId,
                                examId: o.examId,
                                testNo: o.testNo,
                                trainingItemId: le
                              })
                            );
                          case 5:
                            (a = e.sent), (e.next = 12);
                            break;
                          case 8:
                            return (
                              (e.prev = 8),
                              (e.t0 = e.catch(2)),
                              n.g.$message(
                                (0, y.vs)("examDetail_submit_failed")
                              ),
                              e.abrupt("return", !1)
                            );
                          case 12:
                            if (!a._failure) {
                              e.next = 20;
                              break;
                            }
                            if (15200022 !== +a.code) {
                              e.next = 16;
                              break;
                            }
                            return (
                              ie.isAutoSubmit && Ut.goBack(),
                              e.abrupt("return", !1)
                            );
                          case 16:
                            return N(E.Bc.info), (e.next = 19), oe(!1);
                          case 19:
                          case 25:
                            return e.abrupt("return", !1);
                          case 20:
                            if (0 !== +a.code || !a.body) {
                              e.next = 25;
                              break;
                            }
                            return (
                              (i = a.body),
                              t === E.Bc.result
                                ? (Z({
                                    score: i.score,
                                    markingStatus: i.markingStatus,
                                    status: i.status,
                                    pointNum: i.pointNum,
                                    isSubmit: !0
                                  }),
                                  N(E.Bc.result))
                                : N(t),
                              T(function(e) {
                                return (0,
                                r.Z)((0, r.Z)({}, e), {}, { attemptId: i.attemptId });
                              }),
                              e.abrupt("return", !0)
                            );
                          case 26:
                          case "end":
                            return e.stop();
                        }
                    },
                    e,
                    null,
                    [[2, 8]]
                  );
                })
              );
              return function(t) {
                return e.apply(this, arguments);
              };
            })(),
            Xt = function() {
              Ce && ye(!1);
              var e = Ze ? K + 1 : te + 1;
              Ze
                ? (Xe || We(!1), K === J && R && sn(), on(!1))
                : M(
                    e,
                    function() {
                      return Kt(3, !1, "next");
                    },
                    "next"
                  ),
                C && jt(e - 1);
            },
            jt = function(e) {
              var t = ve.indexOf(e);
              t > -1 && (webcam.capture(), ve.splice(t, 1));
            },
            _t = function(e, t, n, a, o, s) {
              V[te] &&
                V[te].answerList.length >= 0 &&
                B(function(c) {
                  return c.map(function(c) {
                    if (c.questionId === Gt.questionId) {
                      if (e === E.ce.LINE && o)
                        return (0, r.Z)(
                          (0, r.Z)({}, c),
                          {},
                          { images: a || [], hasSubmit: !1, answerList: o }
                        );
                      if (e === E.ce.CASE_ANALYSIS) {
                        var l = Gt.question.newQuestionNodes,
                          u = void 0 === l ? [] : l,
                          m = c.questionNodesAnswer.map(function(e, n) {
                            if (e.questionId === s) {
                              var a = u[n].questionType;
                              return (0, r.Z)(
                                (0, r.Z)({}, e),
                                {},
                                {
                                  answerList:
                                    a === E.ce.SINGLE || e.answerList.length < 1
                                      ? [t]
                                      : e.answerList.find(function(e) {
                                          return e === t;
                                        })
                                      ? e.answerList.filter(function(e) {
                                          return e !== t;
                                        })
                                      : [].concat((0, i.Z)(e.answerList), [t])
                                }
                              );
                            }
                            return e;
                          });
                        return (0, r.Z)(
                          (0, r.Z)({}, c),
                          {},
                          {
                            images: a || [],
                            hasSubmit: !1,
                            questionNodesAnswer: m
                          }
                        );
                      }
                      if (e === E.ce.READ) {
                        var d = c.questionNodesAnswer.map(function(e, n) {
                          if (e.questionId === s)
                            return (0, r.Z)(
                              (0, r.Z)({}, e),
                              {},
                              { answerList: [t] }
                            );
                          if (e.questionNodesAnswer) {
                            var a = e.questionNodesAnswer.map(function(e) {
                              return (
                                console.log("childQues", e),
                                e.questionId === s
                                  ? (0, r.Z)(
                                      (0, r.Z)({}, e),
                                      {},
                                      { answerList: [t] }
                                    )
                                  : e
                              );
                            });
                            return (0, r.Z)(
                              (0, r.Z)({}, e),
                              {},
                              { questionNodesAnswer: a }
                            );
                          }
                          return e;
                        });
                        return (0, r.Z)(
                          (0, r.Z)({}, c),
                          {},
                          {
                            answerList: [],
                            images: a || [],
                            hasSubmit: !1,
                            questionNodesAnswer: d
                          }
                        );
                      }
                      return e === E.ce.FILL_IN_BLANK && n
                        ? (0, r.Z)(
                            (0, r.Z)({}, c),
                            {},
                            {
                              answerList: n,
                              hasSubmit: !1,
                              answerList4Blank: Gt.question.sectionRespList.map(
                                function(e, t) {
                                  return {
                                    sectionId: e.sectionId,
                                    answer: n[t]
                                  };
                                }
                              )
                            }
                          )
                        : (0, r.Z)(
                            (0, r.Z)({}, c),
                            {},
                            {
                              images: a || [],
                              hasSubmit: !1,
                              answerList:
                                e === E.ce.SINGLE || c.answerList.length < 1
                                  ? [t]
                                  : c.answerList.find(function(e) {
                                      return e === t;
                                    })
                                  ? c.answerList.filter(function(e) {
                                      return e !== t;
                                    })
                                  : [].concat((0, i.Z)(c.answerList), [t])
                            }
                          );
                    }
                    return c;
                  });
                });
            },
            $t = (function() {
              var e = (0, c.Z)(
                s().mark(function e() {
                  return s().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), Kt(3, !1, "scantron");
                        case 2:
                          ge(!0);
                        case 3:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })(),
            en = (function() {
              var e = (0, c.Z)(
                s().mark(function e(t, n) {
                  return s().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), Kt(3, !0, n);
                        case 2:
                          if (!e.sent) {
                            e.next = 9;
                            break;
                          }
                          return (e.next = 6), Ht(t);
                        case 6:
                          (window.onblur = null),
                            (window.onfocus = null),
                            (window.onresize = null);
                        case 9:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function(t, n) {
                return e.apply(this, arguments);
              };
            })(),
            tn = (function() {
              var e = (0, c.Z)(
                s().mark(function e() {
                  return s().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), en(E.Bc.result, "auto");
                        case 2:
                          G && be(!1);
                        case 3:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })(),
            nn = function(e) {
              if (e) {
                var a = m().createElement(
                  "div",
                  { className: t.beyondDeadlineContent },
                  (0, y.vs)("examDetail_overtime")
                );
                n.g.$confirm({
                  visible: !0,
                  onOk: (function() {
                    var e = (0, c.Z)(
                      s().mark(function e(t) {
                        return s().wrap(function(e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (e.next = 2), en(E.Bc.info, "auto");
                              case 2:
                                G && (t(!1), oe(!1));
                              case 3:
                              case "end":
                                return e.stop();
                            }
                        }, e);
                      })
                    );
                    return function(t) {
                      return e.apply(this, arguments);
                    };
                  })(),
                  content: a,
                  userClose: !0
                });
              } else ge(!1), be(!0);
              re({ recognitionStatus: null, remainSeconds: null });
            },
            an = m().createElement(
              "div",
              { className: t.timeLimitDialogBox },
              m().createElement(
                "div",
                { className: t.timeLimitText },
                (0, y.vs)("examDetail_next_step")
              ),
              m().createElement(p.Z, {
                control: m().createElement(A.Z, {
                  icon: m().createElement(g.Z, { fontSize: "small" }),
                  checkedIcon: m().createElement(f.Z, { fontSize: "small" }),
                  checked: Ve,
                  onChange: function(e) {
                    Je(e.target.checked);
                  },
                  inputProps: { "aria-label": "primary checkbox" },
                  color: "primary"
                }),
                label: (0, y.vs)("examDetail_not_prompt_again"),
                classes: { label: t.timeLimitLabel }
              })
            ),
            rn = function(e) {
              R && clearInterval(R);
              var t,
                n = (0, v.find)(ie.timeLimitArr, ["questionType", e]);
              (t = (n && n.limitTime) || 0),
                (D = t),
                qe(t),
                Me(t),
                (R = setInterval(
                  (0, c.Z)(
                    s().mark(function e() {
                      return s().wrap(function(e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              if (!(D > 0)) {
                                e.next = 6;
                                break;
                              }
                              Me(D - 1), D--, (e.next = 17);
                              break;
                            case 6:
                              if ((clearInterval(R), Me(0), 0 !== D)) {
                                e.next = 17;
                                break;
                              }
                              if (K !== w.length - 1) {
                                e.next = 13;
                                break;
                              }
                              on(!0), (e.next = 17);
                              break;
                            case 13:
                              if (K === w.length - 1 || K !== J) {
                                e.next = 17;
                                break;
                              }
                              if (!H && !X) {
                                e.next = 16;
                                break;
                              }
                              return e.abrupt("return");
                            case 16:
                              on(!1);
                            case 17:
                            case "end":
                              return e.stop();
                          }
                      }, e);
                    })
                  ),
                  1e3
                ));
            },
            on = function(e) {
              ye(!1),
                zt(!0, "next"),
                Kt(3, !1, "next", function(t) {
                  if (t) {
                    if (!e) M(K + 1, "", "next");
                    zt(!1, "next");
                  } else zt(!1, "next");
                });
            },
            sn = function() {
              clearInterval(R), Me(0), (D = 0);
            },
            cn = function() {
              return "".concat(
                100 * (1 - (0 === Ue ? Ue : Ue - 1) / (0 === Le ? Le : Le - 1)),
                "%"
              );
            },
            ln = function() {
              return (
                Ze &&
                V &&
                V[te] &&
                (!V[te].done || (V[te].done && K === J && R && D > 0))
              );
            },
            un = function() {
              rt(!1),
                (window.opener = null),
                window.open("", "_self"),
                window.close();
            },
            mn = (function() {
              var e = (0, c.Z)(
                s().mark(function e(t) {
                  var n, a;
                  return s().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (!t) {
                            e.next = 11;
                            break;
                          }
                          return (
                            rt(!0),
                            lt((0, y.vs)("about_to_quit")),
                            pt((0, y.vs)("examDetail_determine")),
                            (n = 15),
                            (a = setInterval(function() {
                              0 === --n && (clearInterval(a), un()),
                                pt((0, y.vs)("countdown", { countNum: n }));
                            }, 1e3)),
                            sn(),
                            (e.next = 9),
                            Kt(3, !0, "end")
                          );
                        case 9:
                          return (
                            (e.next = 11),
                            x.Oe.submitNewExamPaper({
                              attemptId: o.attemptId,
                              examId: o.examId,
                              testNo: o.testNo,
                              trainingItemId: le
                            })
                          );
                        case 11:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function(t) {
                return e.apply(this, arguments);
              };
            })(),
            dn = (function() {
              var e = (0, c.Z)(
                s().mark(function e() {
                  return s().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if ((ht(!1), !xt || 0 !== xt.remainderTimes)) {
                            e.next = 4;
                            break;
                          }
                          return (e.next = 4), en(E.Bc.result, "auto");
                        case 4:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })();
          return m().createElement(
            m().Fragment,
            null,
            m().createElement(
              "div",
              { className: t.top },
              m().createElement(
                "div",
                { className: t.topLeft },
                m().createElement(
                  "div",
                  { className: t.subjectNum },
                  m().createElement(
                    "span",
                    { className: t.currentSubject },
                    Gt.questionNo
                  ),
                  m().createElement(
                    "span",
                    { className: t.totalSubject },
                    "/",
                    w.length
                  )
                ),
                m().createElement(
                  "div",
                  { className: t.subjectType },
                  Gt.question ? E.tX[Gt.question.questionType || ""] : ""
                ),
                ln() &&
                  m().createElement(
                    "div",
                    { className: t.timeLimit },
                    m().createElement("img", {
                      src: Q,
                      alt: "",
                      className: t.timeLimitIcon
                    }),
                    m().createElement(
                      "span",
                      null,
                      (0, y.vs)("examDetail_time_limit", { nowLimitTime: Ue })
                    )
                  ),
                Ze &&
                  V &&
                  V[te] &&
                  V[te].done &&
                  (K !== J || (K === J && D < 1)) &&
                  m().createElement(
                    "div",
                    { className: t.timeLimitDisabled },
                    (0, y.vs)("examDetail_unchangeable")
                  )
              ),
              ln() &&
                m().createElement(
                  m().Fragment,
                  null,
                  m().createElement("div", {
                    className: t.timeProgress,
                    style: {
                      width: cn(),
                      transition: "0%" !== cn() ? "width 1s linear" : ""
                    }
                  }),
                  m().createElement("div", { className: t.timeProgressLine })
                ),
              m().createElement(
                "div",
                { className: t.topRight },
                !!Qt &&
                  m().createElement(U, { remainTime: Qt, countTimeEnd: nn }),
                m().createElement(
                  "div",
                  { className: t.submitExamBtn, onClick: $t },
                  m().createElement("img", { className: t.submitIcon, src: q }),
                  m().createElement(
                    "div",
                    { className: t.submitExam },
                    (0, y.vs)("examDetail_submit_exam_page")
                  )
                )
              )
            ),
            Gt &&
              Gt.question &&
              (Gt.question.sectionRespList || Gt.question.newQuestionNodes) &&
              m().createElement(F.Z, {
                changeViewAnswerTipsState: function(e) {
                  ye(e);
                },
                viewAnswerTipsState: Ce,
                currentIndex: te,
                currentSubject: Gt.question,
                currentLength: w.length,
                answerList: (function(e, t) {
                  if (!e.length) return [];
                  if (!e[t]) return [];
                  var n = e[t],
                    a = n.answerList,
                    i = void 0 === a ? [] : a,
                    r = n.questionNodesAnswer,
                    o = void 0 === r ? [] : r;
                  return o.some(function(e) {
                    return (
                      e.questionNodesAnswer && e.questionNodesAnswer.length
                    );
                  })
                    ? o
                    : i.length > 0
                    ? i
                    : o.map(function(e) {
                        return e.answerList;
                      });
                })(h, te),
                images: (h[te] && h[te].images) || [],
                onSelectOption: function(e, t, n, a) {
                  var i = "",
                    r = "",
                    o = Gt.question.questionType;
                  "string" === typeof e && (i = e),
                    "object" === typeof e &&
                      ((i = e.sectionId), (r = e.childId)),
                    (o !== E.ce.SINGLE &&
                      o !== E.ce.JUDGE &&
                      o !== E.ce.QUESTION_ANSWER &&
                      o !== E.ce.ATTACMENT) ||
                      _t(E.ce.SINGLE, i, void 0, n),
                    (o !== E.ce.MULTIPLE && o !== E.ce.IMAGE) ||
                      _t(E.ce.MULTIPLE, i),
                    o === E.ce.FILL_IN_BLANK && _t(E.ce.FILL_IN_BLANK, i, t),
                    o === E.ce.LINE && _t(E.ce.LINE, i, void 0, void 0, a),
                    o === E.ce.CASE_ANALYSIS &&
                      _t(E.ce.CASE_ANALYSIS, i, void 0, void 0, void 0, r),
                    o === E.ce.GROUP_SINGLE &&
                      _t(E.ce.CASE_ANALYSIS, i, void 0, void 0, void 0, r),
                    o === E.ce.READ &&
                      _t(E.ce.READ, i, void 0, void 0, void 0, r);
                },
                setOperateVisible: tt,
                isViewErrorQuestions: !1,
                isFromResult: ae,
                detail: ie,
                disabled:
                  Ze &&
                  V &&
                  V[te] &&
                  ((V[te].done && K !== J) || (K === J && D < 1)),
                limitSize: ue
              }),
            o &&
              o.questionIdList &&
              o.questionIdList.length > 1 &&
              m().createElement(
                "div",
                { className: t.manipulate },
                0 === te &&
                  m().createElement(
                    "div",
                    { className: t.buttonDisabled },
                    (0, y.vs)("examDetail_previous")
                  ),
                0 !== te &&
                  m().createElement(
                    I.Z,
                    {
                      loading: Ot,
                      className: t.manipulateBtn,
                      onClick: function() {
                        Ce && ye(!1),
                          M(
                            te - 1,
                            function() {
                              return Kt(3, !1, "up");
                            },
                            "up"
                          );
                      }
                    },
                    (0, y.vs)("examDetail_previous")
                  ),
                te !== w.length - 1 &&
                  m().createElement(
                    I.Z,
                    {
                      loading: Pt || Mt,
                      className: "".concat(t.manipulateBtn, " ").concat(t.next),
                      onClick: function() {
                        if ((Ce && ye(!1), Ze)) {
                          if (!Xe && ln()) return void We(!0);
                          Xe && K === J && R && sn();
                        }
                        Xt();
                      }
                    },
                    (0, y.vs)("examDetail_next")
                  ),
                te === w.length - 1 &&
                  m().createElement(
                    "div",
                    {
                      className: "".concat(t.buttonDisabled, " ").concat(t.next)
                    },
                    (0, y.vs)("examDetail_next")
                  )
              ),
            m().createElement(L, {
              onChangeQuestionNo: M,
              visible: Ae,
              closeDialog: function() {
                ge(!1);
              },
              setCurrentIndex: ne,
              questionAnswers: h,
              submitExam: en,
              timeLimitState: Ze
            }),
            Ze &&
              m().createElement(b.Z, {
                onCancel: function() {
                  We(!1);
                },
                onOk: function() {
                  Ve && je(!0), We(!1), sn(), Xt();
                },
                visible: ze,
                content: an,
                confirmAndCancel: !0
              }),
            Ie &&
              m().createElement(O, {
                questionNum: o.questionIdList.length,
                autoSubmitExam: tn,
                networkState: G
              }),
            m().createElement(b.Z, {
              visible: it,
              content: ct,
              onOk: un,
              okText: dt,
              contentStyle: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }
            }),
            m().createElement(
              b.Z,
              {
                visible: ft,
                footer: m().createElement(
                  "div",
                  { className: t.dialogFooter },
                  m().createElement(
                    z.Z,
                    {
                      disabled: Nt,
                      type: "button",
                      className: Nt ? t.searchBtn : "",
                      onClick: function() {
                        return dn();
                      }
                    },
                    (0, y.vs)("i_got_it")
                  )
                )
              },
              m().createElement(
                "div",
                { className: t.warningText },
                (0, y.vs)("warning")
              ),
              xt && xt.remainderTimes > 0
                ? m().createElement(
                    "div",
                    null,
                    (0, y.vs)("cheating_times", {
                      maxTimes: xt.maxTimes - xt.remainderTimes,
                      remainderTimes: xt.remainderTimes
                    })
                  )
                : m().createElement(
                    "div",
                    null,
                    (0, y.vs)("cut_screen_maxTimes", {
                      maxTimes: xt && xt.maxTimes
                    })
                  )
            ),
            m().createElement(
              b.Z,
              {
                visible: St,
                footer: m().createElement(
                  "div",
                  { className: t.dialogFooter },
                  m().createElement(
                    z.Z,
                    {
                      disabled: Rt,
                      type: "button",
                      className: Rt ? t.searchBtn : "",
                      onClick: function() {
                        kt(!1);
                      }
                    },
                    (0, y.vs)("i_got_it")
                  )
                )
              },
              m().createElement(
                "div",
                { className: t.warningText },
                (0, y.vs)("warning")
              ),
              m().createElement(
                "div",
                null,
                (0, y.vs)("cut_screen_times", { maxTimes: me && me.maxTimes })
              )
            )
          );
        });
    },
    13730: function(e, t, n) {
      "use strict";
      n.d(t, {
        Z: function() {
          return J;
        }
      });
      var a,
        i = n(84322),
        r = n.n(i),
        o = n(33032),
        s = n(20042),
        c = n(67294),
        l = n.n(c),
        u = n(30381),
        m = n.n(u),
        d = n(52543),
        p = n(40053),
        A = n(67246),
        g = n(44568),
        f = n(51406),
        h = n(91155),
        v = n(87623),
        E = n(48623),
        x = n(50124),
        w = n(87027),
        I = n(69134),
        b = (0, d.Z)(function(e) {
          return (0,
          v.Z)({ paper: { display: "flex", alignItems: "center", width: 570, height: 296 }, title: { width: 430, marginTop: 70, fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center", wordWrap: "break-word", wordBreak: "normal", overflowWrap: "break-word" }, content: { width: 380, marginTop: 14, fontSize: 16, color: "#666", wordWrap: "break-word", wordBreak: "normal", overflowWrap: "break-word" }, footer: { display: "flex", justifyContent: "space-between", width: 380, marginTop: 40 }, dialogBtn: { width: 170 }, cancel: { backgroundColor: "#fff", color: e.palette.primary.main, border: "1px solid ".concat(e.palette.primary.main), "&:hover": { backgroundColor: "#fff" } } });
        })(function(e) {
          var t = e.classes,
            n = e.visible,
            a = e.title,
            i = e.content,
            r = e.children,
            o = e.okText,
            s = e.cancelText,
            c = e.onOk,
            u = e.onCancel,
            m = e.loading;
          return l().createElement(
            E.Z,
            { open: n, disableBackdropClick: !0, classes: { paper: t.paper } },
            l().createElement("div", { className: t.title }, a),
            l().createElement("div", { className: t.content }, i || r),
            l().createElement(
              "div",
              { className: t.footer },
              l().createElement(
                x.Z,
                {
                  className: "".concat(t.dialogBtn, " ").concat(t.cancel),
                  onClick: u
                },
                s || (0, I.vs)("cancel")
              ),
              l().createElement(
                w.Z,
                { className: t.dialogBtn, loading: m || !1, onClick: c },
                o || (0, I.vs)("confirm")
              )
            )
          );
        }),
        S = n(20849),
        k = n(75572),
        C = n(32475);
      !(function(e) {
        (e[(e.takePhoto = 0)] = "takePhoto"),
          (e[(e.uploadFaceImg = 1)] = "uploadFaceImg"),
          (e[(e.identification = 2)] = "identification");
      })(a || (a = {}));
      var y,
        N = 0,
        T = (0, d.Z)(function(e) {
          return (0,
          v.Z)({ paper: { display: "flex", alignItems: "center", width: 570, height: 498 }, title: { marginTop: 50, marginBottom: 40, fontSize: 22, fontWeight: "bold", color: "#333" }, identification: { display: "flex", flexDirection: "column", alignItems: "center", width: 320, marginTop: 40, marginBottom: 20 }, passTitle: { display: "flex", justifyContent: "center", alignItems: "center" }, passIcon: { width: 24, height: 24, marginRight: 6 }, passText: { fontSize: 22, color: "#333" }, recordSuccess: { marginTop: 8, fontSize: 16, color: "#666" }, content: { position: "relative", width: 320, height: 240 }, tip: { position: "absolute", left: 125, top: 360, width: 320, fontSize: 14, color: "#F5212D", textAlign: "center" }, footer: { display: "flex", justifyContent: "space-between", width: 380, marginTop: 40 }, continueFooter: { justifyContent: "center" }, dialogBtn: { width: 170, fontSize: 18 }, tripleBtn: { width: 110, fontSize: 18 }, secondBtn: { backgroundColor: "#fff", color: e.palette.primary.main, border: "1px solid ".concat(e.palette.primary.main), "&:hover": { backgroundColor: "#fff" } }, btnDisabled: { backgroundColor: "#F5F5F5", color: "#999", cursor: "none", pointerEvents: "none" }, secondBtnDisabled: { backgroundColor: "#fff", borderColor: "#ccc", color: "#999", cursor: "none", pointerEvents: "none" }, camPhoto: { position: "absolute", left: 0, top: 0, zIndex: 10 }, camCalibrate: { position: "absolute", width: 320, height: 240, left: "50%", transform: "translateX(-50%)", background: "url(".concat(C, ") no-repeat"), backgroundSize: "100% 100%", zIndex: 20 }, photo: { position: "absolute", left: 0, top: 0, zIndex: 30 } });
        })(function(e) {
          var t = e.classes,
            i = e.password,
            u = e.setInvigilateVisible,
            m = e.startExam,
            d = (0, c.useState)(!0),
            p = (0, s.Z)(d, 2),
            A = p[0],
            g = (p[1], (0, c.useState)(!1)),
            f = (0, s.Z)(g, 2),
            v = f[0],
            b = (f[1], (0, c.useState)(!1)),
            C = (0, s.Z)(b, 2),
            T = C[0],
            Z = C[1],
            B = (0, c.useState)(!0),
            R = (0, s.Z)(B, 2),
            D = R[0],
            L = R[1],
            q = (0, c.useState)(!0),
            Q = (0, s.Z)(q, 2),
            F = Q[0],
            U = Q[1],
            M = (0, c.useState)(!1),
            O = (0, s.Z)(M, 2),
            P = O[0],
            z = O[1],
            W = (0, c.useState)(a.takePhoto),
            Y = (0, s.Z)(W, 2),
            G = Y[0],
            V = Y[1],
            J = (0, c.useState)(!0),
            K = (0, s.Z)(J, 2),
            H = K[0],
            X = K[1];
          (0, c.useEffect)(function() {
            return (
              setTimeout(j, 0),
              function() {
                y.getContext("2d").clearRect(0, 0, 320, 240);
              }
            );
          }, []);
          var j = function() {
              (y = document.createElement("canvas")).setAttribute(
                "width",
                "320px"
              ),
                y.setAttribute("height", "240px"),
                $(y).appendTo("#photo");
              var e = y.getContext("2d"),
                t = e.getImageData(0, 0, 320, 240);
              _(t, e);
            },
            _ = function(e, t) {
              $("#camPhoto").webcam({
                width: 320,
                height: 240,
                mode: "callback",
                swffile: "static/sdk/webcam/jscam_canvas_only.swf",
                onSave: function(n) {
                  ne(n, e, t);
                },
                onCapture: function() {
                  webcam.save();
                },
                debug: function(e, t) {
                  ee(t);
                }
              });
            },
            ee = function(e) {
              "Camera started" === e
                ? (Z(!0), U(!1), L(!1))
                : "Camera stopped" === e
                ? n.g.$confirm({
                    visible: !0,
                    onOk: function() {
                      (0, h.w1)() ? window.location.reload() : te();
                    },
                    content: (0, I.vs)("examDetail_camera_invigilate")
                  })
                : "No camera was detected." === e &&
                  (u(!1), n.g.$message((0, I.vs)("examDetail_camera_unusual")));
            },
            te = function() {
              $("#photo").empty(),
                X(!1),
                setTimeout(function() {
                  X(!0),
                    setTimeout(function() {
                      j();
                    }, 200);
                }, 200);
            },
            ne = function(e, t, n) {
              for (var a = e.split(";"), i = t, r = 0; r < 320; r++) {
                var o = parseInt(a[r], 10);
                (i.data[N + 0] = (o >> 16) & 255),
                  (i.data[N + 1] = (o >> 8) & 255),
                  (i.data[N + 2] = 255 & o),
                  (i.data[N + 3] = 255),
                  (N += 4);
              }
              N >= 307200 && (n.putImageData(i, 0, 0), (N = 0), ae());
            },
            ae = (function() {
              var e = (0, o.Z)(
                r().mark(function e() {
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          V(a.uploadFaceImg);
                        case 1:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })(),
            ie = function() {
              u(!1);
            },
            re = (function() {
              var e = (0, o.Z)(
                r().mark(function e(t, i, o) {
                  var s;
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), S.Oe.uploadFaceImg(i, o, t);
                        case 2:
                          if (!(s = e.sent)._failure) {
                            e.next = 5;
                            break;
                          }
                          return e.abrupt("return");
                        case 5:
                          s.data
                            ? V(a.identification)
                            : (u(!1), n.g.$message(s.message));
                        case 6:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function(t, n, a) {
                return e.apply(this, arguments);
              };
            })(),
            oe = l().createElement(
              "div",
              { className: t.footer },
              l().createElement(
                x.Z,
                {
                  className: "".concat(t.dialogBtn, " ").concat(t.secondBtn),
                  onClick: ie
                },
                (0, I.vs)("cancel")
              ),
              l().createElement(
                w.Z,
                {
                  className: ""
                    .concat(t.dialogBtn, " ")
                    .concat(D ? t.btnDisabled : ""),
                  loading: v,
                  onClick: function() {
                    webcam.capture();
                  }
                },
                (0, I.vs)("examDetail_photograph")
              )
            ),
            se = l().createElement(
              "div",
              { className: t.footer },
              l().createElement(
                x.Z,
                {
                  className: "".concat(t.tripleBtn, " ").concat(t.secondBtn),
                  onClick: ie
                },
                (0, I.vs)("cancel")
              ),
              l().createElement(
                x.Z,
                {
                  className: ""
                    .concat(t.tripleBtn, " ")
                    .concat(t.secondBtn, " ")
                    .concat(P ? t.secondBtnDisabled : ""),
                  onClick: function() {
                    V(a.takePhoto);
                  }
                },
                (0, I.vs)("examDetail_remake")
              ),
              l().createElement(
                w.Z,
                {
                  className: t.tripleBtn,
                  loading: P,
                  onClick: function() {
                    var e = y
                        .toDataURL("image/png")
                        .replace("data:image/png;base64,", ""),
                      t = "",
                      n = "";
                    !0 === (0, h.xG)().isSingleLogin
                      ? (t = "ITRAIN_PORTAL")
                      : (n = i || ""),
                      z(!0),
                      re(e, t, n);
                  }
                },
                G === a.uploadFaceImg
                  ? P
                    ? (0, I.vs)("examDetail_uploading")
                    : (0, I.vs)("examDetail_upload")
                  : ""
              )
            ),
            ce = l().createElement(
              "div",
              { className: "".concat(t.footer, " ").concat(t.continueFooter) },
              l().createElement(
                x.Z,
                { className: t.dialogBtn, onClick: m },
                (0, I.vs)("examDetail_exam_start")
              )
            ),
            le = l().createElement(
              l().Fragment,
              null,
              l().createElement(
                "div",
                { className: t.content },
                H &&
                  l().createElement("div", {
                    id: "camPhoto",
                    className: t.camPhoto
                  }),
                T && l().createElement("div", { className: t.camCalibrate }),
                l().createElement("div", {
                  id: "photo",
                  className: t.photo,
                  style: {
                    display:
                      G === a.uploadFaceImg || G === a.identification
                        ? "block"
                        : "none"
                  }
                })
              ),
              F &&
                l().createElement(
                  "div",
                  { className: t.tip },
                  (0, I.vs)("examDetail_allow_camera")
                )
            ),
            ue = l().createElement(
              l().Fragment,
              null,
              G === a.identification
                ? l().createElement(
                    "div",
                    { className: t.identification },
                    l().createElement(
                      "div",
                      { className: t.passTitle },
                      l().createElement("img", {
                        src: k,
                        className: t.passIcon
                      }),
                      l().createElement(
                        "div",
                        { className: t.passText },
                        (0, I.vs)("examDetail_certification_passed")
                      )
                    ),
                    l().createElement(
                      "div",
                      { className: t.recordSuccess },
                      (0, I.vs)("examDetail_info_enter_success")
                    )
                  )
                : l().createElement(
                    "div",
                    { className: t.title },
                    G === a.takePhoto
                      ? (0, I.vs)("examDetail_take_picture")
                      : P
                      ? (0, I.vs)("examDetail_being_uploaded_review")
                      : (0, I.vs)("examDetail_imgUpload")
                  )
            );
          return l().createElement(
            E.Z,
            { open: A, disableBackdropClick: !0, classes: { paper: t.paper } },
            ue,
            le,
            G === a.takePhoto ? oe : G === a.uploadFaceImg ? se : ce
          );
        }),
        Z = (0, d.Z)(function(e) {
          return (0,
          v.Z)({ inputWrapper: { width: "100%" }, inputBox: { width: "100%", height: 32, padding: "6px 8px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 2, fontSize: 14, color: "#333333" }, errorTip: { marginTop: 10, fontSize: 12, color: "#F5212D" } });
        })(function(e) {
          var t = e.classes,
            n = e.startExam,
            a = e.setInvigilateVisible,
            i = (0, c.useState)(!1),
            u = (0, s.Z)(i, 2),
            m = u[0],
            d = u[1],
            p = (0, c.useState)(""),
            A = (0, s.Z)(p, 2),
            g = A[0],
            f = A[1],
            v = (0, c.useState)(""),
            E = (0, s.Z)(v, 2),
            x = E[0],
            w = E[1],
            k = (0, c.useState)(!1),
            C = (0, s.Z)(k, 2),
            y = C[0],
            N = C[1],
            Z = (0, c.useState)(!0),
            B = (0, s.Z)(Z, 2),
            R = B[0],
            D = B[1],
            L = (0, c.useState)(!1),
            q = (0, s.Z)(L, 2),
            Q = q[0],
            F = q[1],
            U = l().createElement(
              "div",
              { className: t.inputWrapper },
              l().createElement("input", {
                type: "password",
                className: t.inputBox,
                placeholder: (0, I.vs)("login_password"),
                value: g,
                onChange: function(e) {
                  f(e.target.value), N(!1);
                }
              }),
              y && l().createElement("div", { className: t.errorTip }, x)
            ),
            M = (function() {
              var e = (0, o.Z)(
                r().mark(function e() {
                  var t;
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if ("" !== g.trim()) {
                            e.next = 5;
                            break;
                          }
                          return (
                            w((0, I.vs)("enter_password")),
                            N(!0),
                            e.abrupt("return")
                          );
                        case 5:
                          return (
                            d(!0),
                            (e.next = 8),
                            S.Oe.validatePassword((0, h.oB)(g))
                          );
                        case 8:
                          if (((t = e.sent), d(!1), !t._failure)) {
                            e.next = 12;
                            break;
                          }
                          return e.abrupt("return");
                        case 12:
                          t.data
                            ? (D(!1), F(!0))
                            : (w((0, I.vs)("enter_password_again")), N(!0));
                        case 13:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })();
          return l().createElement(
            l().Fragment,
            null,
            l().createElement(
              b,
              {
                visible: R,
                title: (0, I.vs)("enter_password_info"),
                okText: (0, I.vs)("next_txt"),
                onOk: M,
                onCancel: function() {
                  a(!1);
                },
                loading: m
              },
              U
            ),
            Q &&
              l().createElement(T, {
                password: (0, h.oB)(g.trim()),
                startExam: n,
                setInvigilateVisible: a
              })
          );
        }),
        B = (0, d.Z)(function(e) {
          return (0,
          v.Z)({ validatePwd: { width: "100%", marginTop: 14 }, formControl: { height: 32, padding: "6px 8px", color: "#BFBFBF", borderRadius: 2 }, inputErrorTip: { marginTop: 10, fontSize: 12, color: "#F5212D" } });
        })(function(e) {
          e.classes;
          var t = e.setInvigilateVisible,
            n = e.startExam,
            a = (0, c.useState)(!0),
            i = (0, s.Z)(a, 2),
            r = i[0],
            o = i[1],
            u = (0, c.useState)(!1),
            m = (0, s.Z)(u, 2),
            d = m[0],
            p = m[1],
            A = (0, c.useState)(!1),
            g = (0, s.Z)(A, 2),
            f = g[0],
            v = g[1];
          return l().createElement(
            l().Fragment,
            null,
            l().createElement(b, {
              visible: r,
              title: (0, I.vs)("examDetail_face_recognition"),
              content: (0, I.vs)("examDetail_face_recognition_tip"),
              onOk: function() {
                o(!1), !0 === (0, h.xG)().isSingleLogin ? v(!0) : p(!0);
              },
              onCancel: function() {
                t(!1);
              }
            }),
            d &&
              l().createElement(Z, { startExam: n, setInvigilateVisible: t }),
            f && l().createElement(T, { setInvigilateVisible: t, startExam: n })
          );
        }),
        R = n(96486),
        D = n.n(R),
        L = n(37200),
        q = n(22380),
        Q = n(64229),
        F = (0, d.Z)(Q.Z)(function(e) {
          var t = e.classes,
            n = e.detail,
            a = n.isPublishScore,
            i = n.publishScoreTime,
            r = n.isExamType,
            o = n.markingStatus,
            s = !i || new Date(i) < new Date(),
            c = 0 !== a && s;
          c = r ? 2 === o && c : c;
          var u = function(e, n) {
              var a =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : "";
              return l().createElement(
                "div",
                { className: t.dataItem, key: n },
                l().createElement(
                  "div",
                  { className: t.data },
                  l().createElement("div", { className: t.dataNumber }, e),
                  "" !== a &&
                    l().createElement("div", { className: t.dataUnit }, a)
                ),
                l().createElement("div", { className: t.dataText }, n)
              );
            },
            d = n.myHighestScore ? n.myHighestScore : 0,
            p =
              n.testType === L.kq.FORMAL &&
              !D().isNull(n.myHighestScore) &&
              n.attemptNum - n.remianingNum !== L.hn.NO,
            A = n.testType === L.kq.MOCK && !D().isNull(n.myHighestScore),
            g =
              (n.testType === L.kq.MOCK &&
                D().isNull(n.myHighestScore) &&
                n.markingStatus === L.hn.YES) ||
              (n.testType === L.kq.FORMAL &&
                D().isNull(n.myHighestScore) &&
                n.markingStatus === L.hn.YES &&
                n.attemptNum - n.remianingNum !== L.hn.NO),
            f = g
              ? (0, I.vs)("examDetail_exam_marking")
              : (0, I.vs)("examDetail_highestScore", {
                  isPassed: "".concat(
                    n.isPassed
                      ? (0, I.vs)("examDetail_already")
                      : (0, I.vs)("examDetail_not_yet")
                  ),
                  highestScore: d
                }) ||
                (A &&
                  (0, I.vs)("examDetail_highestScore", { highestScore: d })),
            h = g
              ? "".concat(t.testStatus, " ").concat(t.marking)
              : (A && "".concat(t.testStatus, " ").concat(t.mock)) ||
                (p && n.isPassed
                  ? t.testStatus
                  : "".concat(t.testStatus, " ").concat(t.notPassed));
          return l().createElement(
            l().Fragment,
            null,
            l().createElement(
              "div",
              { className: t.topContent },
              l().createElement("div", { className: t.testName }, n.testName),
              f && c && l().createElement("div", { className: h }, f)
            ),
            l().createElement(
              "div",
              { className: t.testContent },
              l().createElement(
                "div",
                { className: t.topData },
                l().createElement("div", { className: t.leftPart }),
                l().createElement("div", { className: t.middlePart }, [
                  u(n.testNum, (0, I.vs)("examDetail_testNumTxt")),
                  u(n.totalScoreStr, (0, I.vs)("examDetail_total")),
                  !!+n.minScoreStr &&
                    u(n.minScoreStr, (0, I.vs)("examDetail_pass_score")),
                  n.testType === L.kq.FORMAL
                    ? u(
                        n.testTime,
                        (0, I.vs)("examDetail_exam_duration"),
                        (0, I.vs)("examDetail_minute")
                      )
                    : u(
                        (0, I.vs)("examDetail_unlimited"),
                        (0, I.vs)("examDetail_exam_duration")
                      )
                ]),
                l().createElement("div", { className: t.rightPart })
              ),
              l().createElement(
                "div",
                { className: t.testInfoWrapper },
                l().createElement(
                  "div",
                  {
                    className:
                      n.isInvigilate === L.hn.YES
                        ? t.invigilateTestInfo
                        : t.testInfo
                  },
                  l().createElement(
                    "div",
                    { className: t.infoItem },
                    l().createElement(
                      "div",
                      { className: t.infoLabel },
                      (0, I.vs)("examDetail_open_time")
                    ),
                    l().createElement(
                      "div",
                      { className: t.info },
                      n.testType === L.kq.FORMAL
                        ? null !== n.startTime || null !== n.endTime
                          ? ""
                              .concat(
                                m()(
                                  n.makeExamFlag
                                    ? n.makeExamStartTime
                                    : n.startTime
                                ).format("lll"),
                                "\n              \u2014\u2014"
                              )
                              .concat(
                                m()(
                                  n.makeExamFlag ? n.makeExamEndTime : n.endTime
                                ).format("lll")
                              )
                          : zn_t_intelligent_portal(
                              "94cc8417",
                              "\u4e0d\u9650\u65f6\u95f4"
                            )
                        : (0, I.vs)("examDetail_no_limit_time")
                    )
                  ),
                  !!n.isAutoSubmit &&
                    l().createElement(
                      "div",
                      { className: t.infoItem },
                      l().createElement(
                        "div",
                        { className: t.autoLabel },
                        zn_t_intelligent_portal(
                          "215b4a21",
                          "\u81ea\u52a8\u4ea4\u5377\u65f6\u95f4\uff1a"
                        )
                      ),
                      l().createElement(
                        "div",
                        { className: t.autoInfo },
                        l().createElement(
                          "span",
                          null,
                          n.isAutoSubmit
                            ? "".concat((0, q.k)(n))
                            : (0, I.vs)("examDetail_no_limit_time")
                        ),
                        l().createElement(
                          "span",
                          { className: t.remainTimes },
                          zn_t_intelligent_portal(
                            "d11f1da5",
                            "\uff08\u65f6\u95f4\u5230\u8fbe\u540e\uff0c\u5c06\u81ea\u52a8\u4ea4\u5377\uff09"
                          )
                        )
                      )
                    ),
                  l().createElement(
                    "div",
                    { className: t.infoItem },
                    l().createElement(
                      "div",
                      { className: t.infoLabel },
                      (0, I.vs)("examDetail_exam_num")
                    ),
                    l().createElement(
                      "div",
                      {
                        className: ""
                          .concat(t.info, " ")
                          .concat(t.remainTimesItem)
                      },
                      n.testType === L.kq.FORMAL
                        ? l().createElement(
                            l().Fragment,
                            null,
                            (0, I.vs)("examDetail_remainTimes", {
                              remianingNum: l().createElement(
                                "span",
                                { className: t.remainTimes },
                                n.remianingNum
                              )
                            })
                          )
                        : (0, I.vs)("examDetail_no_limit_num")
                    )
                  ),
                  l().createElement(
                    "div",
                    { className: t.infoItem },
                    l().createElement(
                      "div",
                      { className: t.infoLabel },
                      (0, I.vs)("examDetail_exam_careful")
                    ),
                    l().createElement(
                      "div",
                      {
                        className: ""
                          .concat(t.info, " ")
                          .concat(t.attentionItem)
                      },
                      (0, I.vs)(
                        "after_start_exam",
                        {
                          text: l().createElement(
                            "span",
                            { style: { color: "red" } },
                            (0, I.vs)("not_close_brower")
                          )
                        },
                        1
                      )
                    )
                  ),
                  n.isInvigilate === L.hn.YES &&
                    l().createElement(
                      "div",
                      { className: t.infoItem },
                      l().createElement(
                        "div",
                        { className: t.infoLabel },
                        (0, I.vs)("examDetail_invigilation_mode")
                      ),
                      l().createElement(
                        "div",
                        {
                          className: ""
                            .concat(t.info, " ")
                            .concat(t.invigilateItem)
                        },
                        (0, I.vs)("examDetail_invigilateItem")
                      )
                    )
                )
              )
            )
          );
        }),
        U = n(57972),
        M = n(95850),
        O = n(20992),
        P = n(9549),
        z = (0, d.Z)(Q.Z)(function(e) {
          var t = e.classes,
            n = e.detail,
            a = e.setExamStage,
            i = e.setIsFromResult,
            u = e.currentTime,
            m = e.examId,
            d = (0, c.useState)(!1),
            p = (0, s.Z)(d, 2),
            A = p[0],
            g = p[1],
            f = n.isPublishScore,
            h = n.publishScoreTime,
            v = n.isExamType,
            E = n.markingStatus,
            x = !h || new Date(h) < new Date(),
            w = 0 !== f && x;
          w = v ? 2 === E && w : w;
          var b = function(e, n, a) {
              return l().createElement(
                "div",
                { className: t.checkItem, onClick: a },
                l().createElement("img", { className: t.checkIcon, src: e }),
                l().createElement("div", { className: t.checkText }, n)
              );
            },
            k = (function() {
              var e = (0, o.Z)(
                r().mark(function e() {
                  var t;
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), S.Oe.isHasAttempt({ examId: m });
                        case 2:
                          if (0 === +(t = e.sent).code) {
                            e.next = 5;
                            break;
                          }
                          return e.abrupt("return");
                        case 5:
                          g(
                            (null === t || void 0 === t ? void 0 : t.body) || !1
                          );
                        case 6:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })(),
            C = +u > n.endTime,
            y =
              "N" === n.ishidenerrquestion &&
              ("F" !== n.testType ||
                1 === n.showErrorType ||
                (2 === n.showErrorType && C)),
            N = n.testType === L.kq.MOCK && n.hasHistoryScore === L.hn.YES;
          return (
            (0, c.useEffect)(function() {
              k();
            }, []),
            l().createElement(
              "div",
              { className: t.checkArea },
              y &&
                w &&
                b(M, (0, I.vs)("examDetail_check_wrong"), function() {
                  i(!1), a(L.Bc.errorQuestions);
                }),
              N &&
                b(O, (0, I.vs)("examDetail_history_results"), function() {
                  a(L.Bc.historyScore);
                }),
              "" !== n.certificateId &&
                n.isPassed === L.hn.YES &&
                w &&
                b(U, (0, I.vs)("examDetail_check_certificate"), function() {
                  a(L.Bc.checkCertificate);
                }),
              A &&
                w &&
                b(
                  P,
                  zn_t_intelligent_portal(
                    "8f0cdc6d",
                    "\u67e5\u770b\u6210\u7ee9\u6392\u884c\u699c"
                  ),
                  function() {
                    window.location.href = "#/home/examScoreRank/".concat(m);
                  }
                )
            )
          );
        }),
        W = n(66045),
        Y = 1,
        G = (0, d.Z)(Q.Z)(function(e) {
          var t = e.classes,
            a = e.examId,
            i = e.detail,
            u = e.onStartInvigilate,
            m = e.onStartExam,
            d = (e.getExamBreakInfo, e.currentTime),
            p = e.cutScreenInfo,
            A = (0, c.useState)((0, I.vs)("examDetail_exam_start")),
            g = (0, s.Z)(A, 2),
            f = g[0],
            v = g[1],
            E = (0, c.useState)(!0),
            x = (0, s.Z)(E, 2),
            b = x[0],
            k = x[1],
            C = (0, c.useState)(!1),
            y = (0, s.Z)(C, 2),
            N = y[0],
            T = y[1],
            Z = (0, c.useState)(""),
            B = (0, s.Z)(Z, 2),
            R = B[0],
            D = B[1],
            q = (0, c.useState)(!1),
            Q = (0, s.Z)(q, 2),
            F = Q[0],
            U = Q[1],
            M = (0, c.useState)(!1),
            O = (0, s.Z)(M, 2),
            P = O[0],
            z = O[1],
            G = (0, c.useState)(!1),
            V = (0, s.Z)(G, 2),
            J = V[0],
            K = V[1],
            H = i.isPc,
            X = void 0 === H ? 1 : H;
          (0, c.useEffect)(
            function() {
              i.testType === L.kq.FORMAL && d && j();
            },
            [i, d]
          );
          var j = function() {
              var e = +d;
              return i.makeExamFlag
                ? i.makeExamStartTime > e || i.makeExamEndTime < e
                  ? (k(!1),
                    void v(
                      i.makeExamStartTime > e
                        ? zn_t_intelligent_portal(
                            "ddda1b57",
                            "\u8865\u8003\u672a\u5f00\u59cb"
                          )
                        : zn_t_intelligent_portal(
                            "f939a5cd",
                            "\u8865\u8003\u5df2\u903e\u671f"
                          )
                    ))
                  : 0 === i.remianingNum
                  ? (k(!1),
                    void v(
                      zn_t_intelligent_portal(
                        "2c8c1f53",
                        "\u5f53\u524d\u5df2\u6ca1\u6709\u8865\u8003\u673a\u4f1a"
                      )
                    ))
                  : void _()
                : null !== i.startTime && null !== i.endTime
                ? i.startTime > e || i.endTime < e
                  ? (k(!1),
                    void v(
                      i.startTime > e
                        ? (0, I.vs)("examDetail_exam_no_start")
                        : (0, I.vs)("examDetail_exam_end")
                    ))
                  : 0 === i.remianingNum
                  ? (k(!1), void v((0, I.vs)("examDetail_exam_complete")))
                  : void _()
                : void v(
                    zn_t_intelligent_portal(
                      "1b04d1ff",
                      "\u5f00\u59cb\u8003\u8bd5"
                    )
                  );
            },
            _ = function() {
              var e = "";
              i.isNeedEnroll === L.hn.YES
                ? i.enrollStatus === L.h2.NO_ENROLL
                  ? (e = (0, I.vs)("examDetail_exam_registration"))
                  : i.enrollStatus === L.h2.CHECKIING_PASSED
                  ? (e =
                      i.attemptNum - i.remianingNum > 0
                        ? (0, I.vs)("examDetail_exam_again")
                        : i.makeExamFlag
                        ? zn_t_intelligent_portal(
                            "f7dbd0f5",
                            "\u5f00\u59cb\u8865\u8003"
                          )
                        : (0, I.vs)("examDetail_exam_start"))
                  : ((e = (0, I.vs)("examDetail_under_review")), k(!1))
                : (e = i.makeExamFlag
                    ? zn_t_intelligent_portal(
                        "f7dbd0f5",
                        "\u5f00\u59cb\u8865\u8003"
                      )
                    : i.attemptNum - i.remianingNum > 0
                    ? (0, I.vs)("examDetail_test_again")
                    : (0, I.vs)("examDetail_exam_start")),
                v(e);
            },
            $ = (function() {
              var e = (0, o.Z)(
                r().mark(function e() {
                  var n;
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), S.Oe.submitExamEnroll(a);
                        case 2:
                          if (!e.sent._failure) {
                            e.next = 5;
                            break;
                          }
                          return e.abrupt("return");
                        case 5:
                          v((0, I.vs)("examDetail_under_review")),
                            k(!1),
                            (n = l().createElement(
                              "div",
                              { className: t.ManipulateDialogContent },
                              (0, I.vs)("examDetail_info_submited")
                            )),
                            D(n),
                            T(!0);
                        case 10:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })(),
            ee = (function() {
              var e = (0, o.Z)(
                r().mark(function e() {
                  var o, s, c, u, m, d, A;
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (
                            ((o =
                              window.outerWidth + 10 >= screen.availWidth &&
                              window.outerHeight + 10 >= screen.availHeight),
                            X)
                          ) {
                            e.next = 6;
                            break;
                          }
                          return (
                            (s = l().createElement(
                              "div",
                              { className: t.ManipulateDialogContent },
                              zn_t_intelligent_portal(
                                "2cf400b0",
                                "\u672c\u8003\u8bd5\u5df2\u88ab\u7ba1\u7406\u5458\u8bbe\u7f6e\u4e3a\u4ec5\u652f\u6301APP\u53c2\u4e0e\u8003\u8bd5\uff0c\u8bf7\u901a\u8fc7APP\u8fdb\u884c\u8003\u8bd5"
                              )
                            )),
                            D(s),
                            T(!0),
                            e.abrupt("return")
                          );
                        case 6:
                          if (!p || 0 !== p.remainderTimes) {
                            e.next = 9;
                            break;
                          }
                          return K(!0), e.abrupt("return");
                        case 9:
                          if (
                            ((c = window.navigator.userAgent.toLocaleLowerCase()),
                            (u = c.indexOf("wxwork") > -1),
                            (m = Number(c.split("chrome/")[1].split(".")[0])),
                            c.includes("mac") &&
                              c.includes("chrome") &&
                              m > 110 &&
                              (o = !0),
                            u && (o = !0),
                            o || i.isFlipScreen !== L.iK.Open)
                          ) {
                            e.next = 17;
                            break;
                          }
                          return z(!0), e.abrupt("return");
                        case 17:
                          if (i.testType !== L.kq.QUIZ) {
                            e.next = 20;
                            break;
                          }
                          return (
                            n.g.$message((0, I.vs)("examDetail_go_from_app")),
                            e.abrupt("return")
                          );
                        case 20:
                          if (
                            i.testType !== L.kq.FORMAL ||
                            i.isOpenScreenShot !== L.hn.YES
                          ) {
                            e.next = 31;
                            break;
                          }
                          return (
                            U(!0),
                            (e.next = 24),
                            S.Oe.getScreenShotInfo({
                              resourceId: a,
                              businessType: 2
                            })
                          );
                        case 24:
                          if (
                            ((d = e.sent),
                            U(!1),
                            !d.body || d.body.status !== Y)
                          ) {
                            e.next = 31;
                            break;
                          }
                          return (
                            (A = l().createElement(
                              "div",
                              { className: t.ManipulateDialogContent },
                              (0, I.vs)("examDetail_forbidden_enter")
                            )),
                            D(A),
                            T(!0),
                            e.abrupt("return")
                          );
                        case 31:
                          i.isNeedEnroll === L.hn.YES
                            ? i.enrollStatus === L.h2.NO_ENROLL
                              ? $()
                              : i.enrollStatus === L.h2.CHECKIING_PASSED && te()
                            : i.isInvigilate === L.hn.YES
                            ? ne()
                            : te();
                        case 32:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })(),
            te = (function() {
              var e = (0, o.Z)(
                r().mark(function e() {
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return U(!0), (e.next = 3), m();
                        case 3:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })(),
            ne = (function() {
              var e = (0, o.Z)(
                r().mark(function e() {
                  var t, n;
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            U(!0),
                            (t = (0, h.xG)()),
                            (e.next = 4),
                            S.Oe.personDetail(t.sessionInfo.userId)
                          );
                        case 4:
                          if (((n = e.sent), U(!1), !n._failure)) {
                            e.next = 8;
                            break;
                          }
                          return e.abrupt("return");
                        case 8:
                          n.body.faceImgUploaded ? te() : u();
                        case 9:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })();
          return l().createElement(
            l().Fragment,
            null,
            l().createElement(
              w.Z,
              {
                loading: F,
                className: ""
                  .concat(t.manipulateBtn, " ")
                  .concat(b ? "" : t.btnDisabled),
                onClick: ee
              },
              f
            ),
            l().createElement(W.Z, {
              visible: N,
              content: R,
              okText: (0, I.vs)("i_got_it"),
              onOk: function() {
                T(!1);
              }
            }),
            l().createElement(
              W.Z,
              {
                visible: P,
                onOk: function() {
                  return z(!1);
                },
                okText: (0, I.vs)("i_got_it")
              },
              l().createElement(
                "div",
                { className: t.warningText },
                (0, I.vs)("warning")
              ),
              l().createElement("div", null, (0, I.vs)("keep_screen_max"))
            ),
            l().createElement(
              W.Z,
              {
                visible: J,
                onOk: function() {
                  return K(!1);
                },
                okText: (0, I.vs)("i_got_it")
              },
              l().createElement(
                "div",
                null,
                (0, I.vs)("administrator_to_unblock")
              )
            )
          );
        }),
        V = n(9828),
        J = (0, d.Z)(Q.Z)(function(e) {
          var t = e.classes,
            n = e.examId,
            a = e.detail,
            i = e.setExamStage,
            u = e.startExam,
            d = e.getExamBreakInfo,
            v = e.setIsFromResult,
            E = e.cutScreenInfo,
            x = (0, c.useState)(!1),
            w = (0, s.Z)(x, 2),
            I = w[0],
            b = w[1],
            k = (0, c.useState)(""),
            C = (0, s.Z)(k, 2),
            y = C[0],
            N = C[1],
            T = V.Z.IntlCommon.browserLanguage,
            Z = "en" === T ? g : p,
            R = "en" === T ? f : A,
            D = "F" === a.testType ? Z : R,
            L = 0 === a.isAgainTest && 1 === a.isPassed,
            q = (function() {
              var e = (0, o.Z)(
                r().mark(function e() {
                  var t;
                  return r().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (e.next = 2), S.Gn.getTimestamp();
                        case 2:
                          if (!(t = e.sent)._failure) {
                            e.next = 5;
                            break;
                          }
                          return e.abrupt("return");
                        case 5:
                          N(t.body.timestamp);
                        case 6:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              );
              return function() {
                return e.apply(this, arguments);
              };
            })();
          return (
            (0, c.useEffect)(function() {
              q(),
                (function() {
                  var e = localStorage.getItem("empId") || "";
                  if (e) {
                    var t = document.getElementById("examDetailWatermark"),
                      n = ""
                        .concat(e, "    ")
                        .concat(m()().format("YYYY.MM.DD"));
                    (0, h.W$)(n, t, "examDetailDom");
                  }
                })();
            }, []),
            l().createElement(
              l().Fragment,
              null,
              l().createElement("img", { className: t.testCategory, src: D }),
              l().createElement(
                "div",
                { className: t.contentWrapper, id: "examDetailWatermark" },
                l().createElement(
                  "div",
                  { className: t.content },
                  l().createElement(F, { detail: a }),
                  !L &&
                    l().createElement(G, {
                      examId: n,
                      detail: a,
                      onStartInvigilate: function() {
                        b(!0);
                      },
                      onStartExam: u,
                      getExamBreakInfo: d,
                      currentTime: y,
                      cutScreenInfo: E
                    }),
                  l().createElement(z, {
                    detail: a,
                    setExamStage: i,
                    setIsFromResult: v,
                    currentTime: y,
                    examId: n
                  })
                )
              ),
              I &&
                l().createElement(B, { startExam: u, setInvigilateVisible: b })
            )
          );
        });
    },
    9057: function(e, t, n) {
      "use strict";
      n.d(t, {
        Z: function() {
          return h;
        }
      });
      var a,
        i = n(20042),
        r = n(67294),
        o = n.n(r),
        s = n(52543),
        c = n(50124),
        l = n(87623),
        u = n(91155),
        m = n(20849),
        d = n(37200),
        p = n(69134),
        A = 0,
        g = 0,
        f = "",
        h = (0, s.Z)(function(e) {
          return (0,
          l.Z)({ invigilate: { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: 640, paddingTop: 129, backgroundColor: "#fff", boxSizing: "border-box" }, examInvigilate: { position: "absolute", height: 0, paddingTop: 0, right: 0, bottom: 0 }, title: { fontSize: 22, fontWeight: "bold", color: "#333" }, camPhoto: { width: 220, height: 166, marginTop: 30 }, examCam: { position: "fixed", right: 70, bottom: 10 }, invigilating: { borderRadius: 15, backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", bottom: 15, right: 75, height: 30, lineHeight: 30, width: 82, display: "flex", alignItems: "center", justifyContent: "center", "& .dot": { width: 8, height: 8, backgroundColor: "#00D3AB", color: "#00D3AB", display: "inline-block", borderRadius: "50%", marginRight: 3 }, "& .word": { color: "#fff", fontSize: 14, display: "inline-block" } }, cancel: { width: 170, height: 48, marginTop: 50, fontSize: 18, backgroundColor: "#fff", color: e.palette.primary.main, border: "1px solid ".concat(e.palette.primary.main), "&:hover": { backgroundColor: "#fff" } }, hide: { display: "none" }, camera: { "&:lang(en)": { width: "280px" } } });
        })(function(e) {
          var t = e.classes,
            s = e.camOpening,
            l = e.attemptId,
            h = e.examId,
            v = e.openCamDone,
            E = e.setExamStage,
            x = (0, r.useState)(!1),
            w = (0, i.Z)(x, 2),
            I = w[0],
            b = w[1],
            S = (0, r.useState)(null),
            k = (0, i.Z)(S, 2),
            C = k[0],
            y = k[1],
            N = (0, r.useState)(null),
            T = (0, i.Z)(N, 2),
            Z = T[0],
            B = T[1];
          (0, r.useEffect)(function() {
            (g = 0), setTimeout(R, 500);
          }, []),
            (0, r.useEffect)(
              function() {
                return function() {
                  L(), a.getContext("2d").clearRect(0, 0, 320, 240);
                };
              },
              [Z]
            ),
            (0, r.useEffect)(
              function() {
                f = l;
              },
              [l]
            );
          var R = function() {
              (a = document.createElement("canvas")).setAttribute(
                "width",
                "320px"
              ),
                a.setAttribute("height", "240px"),
                $(a).appendTo("#examPhoto");
              var e = navigator.userAgent.match(/Chrome\/(([0-9]|\.)+)/),
                t = e && e[1],
                n = a.getContext("2d"),
                i = n.getImageData(0, 0, 320, 240);
              if (t && +t.split(".")[0] >= 66) {
                var r = document.createElement("video");
                y(r),
                  $(r).appendTo("#examCamPhoto"),
                  (webcam.save = function() {
                    P();
                  }),
                  (webcam.capture = function() {
                    webcam.save();
                  }),
                  b(!0);
              } else F(i, n);
            },
            D = function() {
              n.g.$confirm({
                visible: !0,
                content: (0, p.vs)("examDetail_camera_unusual")
              });
            },
            L = function() {
              Z && Z.getTracks()[0].stop();
            },
            q = function() {
              var e,
                t,
                n = a.getContext("2d");
              (e = C),
                (t = n),
                window.setInterval(function() {
                  t.drawImage(e, 0, 0, 320, 240);
                }, 60);
            },
            Q = function(e) {
              (C.srcObject = e), B(e), C.play(), q(), v();
            },
            F = function(e, t) {
              $("#examCamPhoto").webcam({
                width: 220,
                height: 166,
                mode: "callback",
                swffile: "static/sdk/webcam/jscam_canvas_only.swf",
                onSave: function(n) {
                  O(n, e, t);
                },
                onCapture: function() {
                  webcam.save();
                },
                debug: function(e, t) {
                  U(t);
                }
              });
            },
            U = function(e) {
              "Camera started" === e
                ? v()
                : "Camera stopped" === e
                ? n.g.$confirm({
                    visible: !0,
                    onOk: function() {
                      (0, u.w1)() ? window.location.reload() : M();
                    },
                    content: (0, p.vs)("examDetail_camera_invigilate")
                  })
                : "No camera was detected." === e &&
                  n.g.$confirm({
                    visible: !0,
                    content: (0, p.vs)("examDetail_camera_unusual")
                  });
            },
            M = function() {
              $("#examCamPhoto").empty(),
                setTimeout(function() {
                  R();
                }, 200);
            },
            O = function(e, t, n) {
              for (var a = e.split(";"), i = t, r = 0; r < 320; r++) {
                var o = parseInt(a[r], 10);
                (i.data[A + 0] = (o >> 16) & 255),
                  (i.data[A + 1] = (o >> 8) & 255),
                  (i.data[A + 2] = 255 & o),
                  (i.data[A + 3] = 255),
                  (A += 4);
              }
              A >= 307200 && (n.putImageData(i, 0, 0), (A = 0), P());
            },
            P = function() {
              var e = a
                .toDataURL("image/png")
                .replace("data:image/png;base64,", "");
              if (0 === g || 1 === g) {
                var t = g + 1;
                m.Oe.faceCollectBackUp(f, h, e, t);
              }
              0 !== g && m.Oe.faceRecognition(f, h, e), g++;
            };
          return o().createElement(
            "div",
            {
              className: ""
                .concat(t.invigilate, " ")
                .concat(s ? "" : t.examInvigilate)
            },
            s &&
              o().createElement(
                "div",
                { className: t.title },
                (0, p.vs)("examDetail_allow_camera")
              ),
            o().createElement("div", {
              id: "examCamPhoto",
              className: "".concat(t.camPhoto, " ").concat(s ? "" : t.examCam)
            }),
            o().createElement(
              "div",
              { className: "".concat(s ? t.hide : t.invigilating) },
              o().createElement("span", { className: "dot" }, "."),
              o().createElement(
                "span",
                { className: "word" },
                (0, p.vs)("examDetail_invigilating")
              )
            ),
            o().createElement("div", {
              id: "examPhoto",
              style: { display: "none" }
            }),
            I &&
              o().createElement(
                c.Z,
                {
                  onClick: function() {
                    navigator.getUserMedia
                      ? navigator.getUserMedia(
                          { video: { width: 320, height: 240 }, audio: !1 },
                          Q,
                          D
                        )
                      : n.g.$confirm({
                          visible: !0,
                          content: (0, p.vs)("examDetail_camera_unusual")
                        });
                  },
                  style: { top: -65 },
                  className: t.camera
                },
                (0, p.vs)("allow_camera")
              ),
            s &&
              o().createElement(
                c.Z,
                {
                  className: t.cancel,
                  onClick: function() {
                    E(d.Bc.info);
                  }
                },
                (0, p.vs)("cancel")
              )
          );
        });
    },
    33774: function(e, t, n) {
      "use strict";
      n.d(t, {
        Z: function() {
          return Ge;
        }
      });
      var a,
        i = n(79043),
        r = n(89472),
        o = n(18489),
        s = n(67294),
        c = n.n(s),
        l = n(52543),
        u = n(87623),
        m = n(36926),
        d = n(55132),
        p = n(78271),
        A = n(30162),
        g = n(66888),
        f = n(53315),
        h = n(35755),
        v = "#F5212D",
        E = "#52C41A",
        x = "#1890FF",
        w = function(e) {
          return (0, u.Z)({
            tip: {
              fontFamily: "PingFangSC-Regular",
              fontSize: "14px",
              color: "#999999",
              marginTop: 10
            },
            subject: { width: 1e3, margin: "0 auto", minHeight: 338 },
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
            flexBlock: { display: "flex" },
            questionTitle: {
              fontSize: 18,
              lineHeight: "28px",
              display: "flex",
              alignItems: "baseline"
            },
            caseSubject: { width: 820, margin: "0 auto" },
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
            videoWrap: { position: "relative" },
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
              background: "url(".concat(h, ") no-repeat"),
              backgroundSize: "42px 42px"
            },
            video: { width: "100%", height: "100%" },
            hasResource: { marginRight: 50 },
            hasIEResource: { marginRight: 50 },
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
              "& img": { width: "100%" }
            },
            selectedOption: { borderColor: x, color: x },
            successIcon: {
              width: 22,
              height: 22,
              background: "url(".concat(f, ") no-repeat"),
              backgroundSize: "22px 22px",
              display: "inline-block"
            },
            checkBoxWrap: { display: "flex", alignItems: "center", flex: 1 },
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
              background: "url(".concat(m, ") no-repeat"),
              display: "inline-block",
              backgroundSize: "20px 20px"
            },
            questionAndAnswer: { fontSize: 16, color: "#333" },
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
              "&::placeholder": { paddingTop: 1 }
            },
            answerLength: {
              width: "100%",
              textAlign: "right",
              fontSize: 16,
              color: "#B2B2B2",
              marginTop: 10
            },
            myAnswerTitle: { margin: "10px 0" },
            myAnswerBox: {
              width: "100%",
              minHeight: 40,
              borderBottom: "1px solid #E5E5E5",
              lineHeight: "30px"
            },
            referAnswerTitle: { color: "#666", margin: "13px 0 10px" },
            referAnswer: { color: "#666", lineHeight: "30px" },
            imageOptions: { justifyContent: "space-between" },
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
            imgNum: { marginTop: 18, marginBottom: 20 },
            imgAnswer: { width: "100%", height: "100%" },
            previewIcon: {
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 24,
              height: 24,
              background: "url(".concat(g, ") no-repeat"),
              backgroundSize: "24px 24px"
            },
            selectedImage: { border: "6px solid ".concat(x) },
            myAnswerWrap: { fontSize: 14, margin: "10px 0 30px" },
            myAnswerText: { color: v, marginRight: 20 },
            correctAnswerText: { color: E },
            errorBorderColor: { borderColor: v, color: v },
            correctBorderColor: { borderColor: E },
            correctOptions: { border: "none", background: E, color: "#FFF" },
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
              "&:hover": { background: "#FFF2E0" }
            },
            downloadBtn: {
              width: "auto",
              padding: "0 10px",
              background: "#fff",
              border: "1px solid #999",
              color: "#666",
              "&:hover": { background: "#FFF" }
            },
            promptIcon: {
              display: "inline-block",
              width: 18,
              height: 18,
              background: "url(".concat(d, ") no-repeat"),
              backgroundSize: "18px 18px",
              margin: "0 3px 0 13px",
              borderRadius: "2px"
            },
            downloadIcon: {
              background: "url(".concat(p, ") no-repeat"),
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
              background: "url(".concat(A, ") no-repeat"),
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
            flexContainer: { flex: 1 },
            videoPlayer: {
              width: "270px!important",
              height: "152px!important",
              background: "#333"
            },
            attachmentWrap: { marginBottom: 70 },
            attachmentTitle: { color: "#333", fontSize: 16 },
            attachmentTipText: { color: "#999", fontSize: 14 }
          });
        },
        I = n(37200),
        b = n(36222),
        S = n(17186),
        k = n(20042),
        C = n(94184),
        y = n.n(C),
        N = n(91155),
        T = n(80117),
        Z = n(45759),
        B = (0, l.Z)(function(e) {
          return (0,
          u.Z)({ modalWrap: { width: "100vw", height: "100vh", minHeight: 700, backgroundColor: "rgba(0,0,0,0.6)", position: "fixed", top: 0, left: 0, zIndex: 1e3, display: "flex", justifyContent: "center", alignItems: "center" }, resourceWrap: { position: "relative" }, close: { position: "absolute", right: 0, top: 0, width: 40, height: 40, background: "url(".concat(T, ") no-repeat"), backgroundSize: "40px 40px" }, image: { width: 700, height: 700, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain" }, video: { width: "870px!important", height: "490px!important", marginTop: 60, marginBottom: 60, background: "#333" } });
        })(function(e) {
          var t = e.classes,
            n = e.visible,
            a = e.resourceUrl,
            i = e.closeModal,
            r = e.type;
          return c().createElement(
            c().Fragment,
            null,
            n &&
              c().createElement(
                "div",
                { className: t.modalWrap },
                c().createElement(
                  "div",
                  { className: t.resourceWrap },
                  c().createElement("div", { className: t.close, onClick: i }),
                  "img" === r
                    ? c().createElement("div", {
                        className: t.image,
                        style: { backgroundImage: "url(".concat(a, ") ") }
                      })
                    : c().createElement(Z.Z, {
                        className: t.video,
                        playUrl: a,
                        controls: !0,
                        controlsList: "nodownload"
                      })
                )
              )
          );
        }),
        R = n(96486),
        D = n.n(R),
        L = n(81410);
      var q,
        Q,
        F = (0, l.Z)(function(e) {
          return (0,
          u.Z)({ blankInput: { opacity: 0, position: "absolute", top: -1e3, left: -1e3, width: 300, height: 32, padding: "6px 8px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: 2, fontSize: 14, color: "#333333", pointerEvents: "none" }, showInput: { opacity: 1 }, blankTextBox: { marginBottom: 10, lineHeight: "34px", "& .titleGapWrap": { display: "inline", margin: "0 4px 0px 12px" }, "& .flexBlock": { display: "flex" }, "& .titleGap": { display: "inline", whiteSpace: "normal", border: "1px solid #B2B2B2", borderRadius: 4, marginRight: 8, marginLeft: 8, lineHeight: "28px", padding: "5px 6px" }, "& .blanksDetail": { display: "inline-block", background: "#FFFFFF", borderRadius: 4, width: 24, height: 28, fontSize: 18, textAlign: "center", lineHeight: "28px", fontWeight: "normal", verticalAlign: "middle" }, "& .answerBlanksDetail": { width: "auto" }, "& .hasContent": { borderColor: "#1890FF", color: "#1890FF" }, "& .wrongBlank": { borderColor: "#F5212D", color: "#F5212D" }, "& .rightBlank": { borderColor: "#52C41A", color: "#52C41A" } }, flexBox: { display: "flex" } });
        })(function(e) {
          var t = e.classes,
            n = e.currentSubject,
            i = e.onSelectOption,
            r = e.isViewErrorQuestions,
            o = e.answerList,
            l = e.isFromResult,
            u = e.disabled,
            m = e.showAnswerStatus,
            d = n.myAnswer,
            p = n.questionText,
            A = n.sectionRespList,
            g = void 0 === A ? [] : A,
            f = n.questionId,
            h = n.isAnswerOrder,
            v = g.map(function() {
              return "";
            }),
            E = g.map(function(e) {
              return e.sectionText;
            }),
            x = (0, s.useRef)(null),
            w = (0, s.useRef)(
              r
                ? l && d && d.length > 0 && m
                  ? d
                  : v
                : o && o.length > 0
                ? o
                : v
            ),
            I = (0, s.useRef)(null),
            b = (0, s.useState)({ inputIndex: -1, stringIndex: -1 }),
            C = (0, k.Z)(b, 2),
            y = C[0],
            N = C[1],
            T = (0, s.useState)(!1),
            Z = (0, k.Z)(T, 2),
            B = Z[0],
            D = Z[1],
            q = (0, s.useState)(!1),
            Q = (0, k.Z)(q, 2),
            F = Q[0],
            U = Q[1],
            M = (0, s.useState)(""),
            O = (0, k.Z)(M, 2),
            P = O[0],
            z = O[1],
            W = function(e) {
              var t = e.target;
              if (t) {
                var n = t;
                if ("space-box" === n.getAttribute("data-type")) {
                  var a = n.getAttribute("data-index");
                  null !== a && G(e, +a);
                }
              }
            };
          (0, s.useEffect)(
            function() {
              var e, t;
              u
                ? null === (e = x.current) ||
                  void 0 === e ||
                  e.removeEventListener("click", W)
                : null === (t = x.current) ||
                  void 0 === t ||
                  t.addEventListener("click", W);
            },
            [p, u]
          ),
            (0, s.useEffect)(function() {
              (document.oncontextmenu = function(e) {
                e.preventDefault();
              }),
                (document.onselectstart = function(e) {
                  e.preventDefault();
                }),
                (document.onpaste = function() {
                  return !1;
                }),
                (document.oncopy = function() {
                  return !1;
                }),
                (document.oncut = function() {
                  return !1;
                }),
                (document.onclick = V);
            }, []),
            (0, s.useEffect)(
              function() {
                if (B) {
                  var e = K(y.inputIndex);
                  Y(y.inputIndex, e);
                }
              },
              [w.current]
            );
          var Y = function(e, t) {
              N({ inputIndex: e, stringIndex: t });
            },
            G = function(e, t) {
              if (
                (e.stopImmediatePropagation(), !r && !u && null !== I.current)
              ) {
                I.current.focus();
                var n = K(t);
                Y(t, n), z(w.current[t]), D(!0);
              }
            },
            V = function() {
              D(!1), Y(-1, -1);
            },
            J = function(e, t) {
              if (!r) {
                var n = w.current.map(function(n, a) {
                  return a !== t ? n : e;
                });
                (w.current = n), i && i("0", n);
              }
            },
            K = function(e) {
              for (
                var t = g[e].sectionText.length - 1, n = 0;
                n < g[e].sectionText.length;
                n++
              )
                if (!w.current || !w.current[e] || !w.current[e][n]) return n;
              return t;
            },
            H = JSON.parse(JSON.stringify(E)),
            X = function(e) {
              if (r) {
                if (l) {
                  var t = d && d[e] ? d[e] : "",
                    n = E[e];
                  if (1 === h) {
                    var a = H.findIndex(function(e) {
                      return e === t;
                    });
                    return a > -1
                      ? (H.splice(a, 1), "rightBlank")
                      : "wrongBlank";
                  }
                  var i = (0, R.isEmpty)(t);
                  return (t !== n || i) && m
                    ? "wrongBlank"
                    : t === n
                    ? "rightBlank"
                    : "";
                }
                return "rightBlank";
              }
              return (w.current && w.current[e]) || y.inputIndex === e
                ? "hasContent"
                : "";
            },
            j = "".concat(t.blankInput).concat(F ? " " + t.showInput : "");
          return c().createElement(
            "div",
            { className: t.blankTextBox },
            c().createElement(
              "div",
              { ref: x },
              (function() {
                var e = p || "",
                  t = e.match(/#(\d+)#/gi);
                return (
                  t &&
                    t.forEach(function(t, n) {
                      var a,
                        i =
                          ((a = n),
                          0 === w.current[a].length
                            ? ' <span\n          class="titleGap '
                                .concat(X(a), '"\n          style="opacity:')
                                .concat(u ? 0.5 : 1, '"\n        >\n          ')
                                .concat(
                                  "  "
                                    .split("")
                                    .map(function(e, t) {
                                      return '<span\n                key="'
                                        .concat(f, " - ")
                                        .concat(a, "-")
                                        .concat(
                                          t,
                                          '"\n                data-type="space-box"\n                data-index="'
                                        )
                                        .concat(
                                          a,
                                          '"\n                class="blanksDetail"\n                id="gap-'
                                        )
                                        .concat(a, "-")
                                        .concat(
                                          t,
                                          '"\n              >\n                '
                                        )
                                        .concat(
                                          (w.current[a] && w.current[a][t]) ||
                                            "",
                                          "\n              </span>"
                                        );
                                    })
                                    .join(""),
                                  "\n        </span>"
                                )
                            : ' <span\n        class="titleGap '
                                .concat(X(a), '"\n        style="opacity:')
                                .concat(u ? 0.5 : 1, '"\n      >\n        ')
                                .concat(
                                  w.current[a]
                                    .split("")
                                    .map(function(e, t) {
                                      return '<span\n              key="'
                                        .concat(f, " - ")
                                        .concat(a, "-")
                                        .concat(
                                          t,
                                          '"\n              data-type="space-box"\n              data-index="'
                                        )
                                        .concat(
                                          a,
                                          '"\n              class="blanksDetail answerBlanksDetail"\n              id="gap-'
                                        )
                                        .concat(a, "-")
                                        .concat(
                                          t,
                                          '"\n            >\n              '
                                        )
                                        .concat(
                                          (w.current[a] && w.current[a][t]) ||
                                            "",
                                          "\n            </span>"
                                        );
                                    })
                                    .join(""),
                                  "\n      </span>"
                                ));
                      e = e.replace(t, i);
                    }),
                  c().createElement(L.Z, {
                    text: String.raw(a || (a = (0, S.Z)(["", ""])), e)
                  })
                );
              })()
            ),
            c().createElement("input", {
              className: j,
              ref: I,
              type: "text",
              maxLength: 30,
              onChange: function(e) {
                if (!r) {
                  var t = (function(e) {
                      var t = e.trim(),
                        n = !0;
                      (t.indexOf("\uff1a") > -1 || t.indexOf(":") > -1) &&
                        ((t = t.replace(/\uff1a|:/g, "")), (n = !1));
                      return { allValid: n, value: t };
                    })(e.target.value),
                    n = t.allValid,
                    a = t.value;
                  z(a), n || U(!1), (F && n) || J(a, y.inputIndex);
                }
              },
              value: P,
              onCompositionStart: function(e) {
                r || U(!0);
              },
              onCompositionEnd: function() {
                r || (U(!1), J(P, y.inputIndex));
              },
              disabled: u
            })
          );
        }),
        U = (n(8248), n(63468)),
        M = n(69134),
        O = (0, l.Z)(w)(function(e) {
          var t = e.classes,
            n = e.description,
            a = e.viewAnswerTipsState,
            i = e.changeViewAnswerTipsState,
            r = e.fileUrl,
            o = e.isOpenAnswer,
            s = "";
          if (r) {
            var l = r.lastIndexOf("/");
            s = r.substring(l + 1);
          }
          var u = o && i,
            m = u || r || a ? t.promptWrap : "";
          return c().createElement(
            "div",
            { className: m },
            u &&
              c().createElement(
                "div",
                {
                  className: t.prompt,
                  onClick: function() {
                    return i && i(!0);
                  }
                },
                c().createElement("div", { className: t.promptIcon }),
                c().createElement(
                  "div",
                  null,
                  (0, M.vs)("examDetail_prompt_tip")
                )
              ),
            r
              ? c().createElement(
                  "div",
                  {
                    onClick: function() {
                      var e =
                        "http" === r.substr(0, 4).toLowerCase()
                          ? r || ""
                          : "".concat(U.dM.API_PREFIX, "/").concat(r);
                      if ((0, N.w1)()) {
                        var t = document.createElement("a");
                        t.setAttribute("href", e),
                          t.setAttribute("download", s),
                          (t.text = ""),
                          document.body.appendChild(t),
                          t.click();
                      } else {
                        var n = new XMLHttpRequest();
                        n.open("GET", e, !0),
                          (n.responseType = "blob"),
                          (n.onload = function(e) {
                            var t = window.URL.createObjectURL(n.response),
                              a = document.createElement("a");
                            (a.href = t), (a.download = s), a.click();
                          }),
                          n.send();
                      }
                    },
                    className: "".concat(t.prompt, " ").concat(t.downloadBtn)
                  },
                  c().createElement("div", {
                    className: ""
                      .concat(t.promptIcon, " ")
                      .concat(t.downloadIcon)
                  }),
                  c().createElement(
                    "div",
                    null,
                    (0, M.vs)("examDetail_download_exam")
                  )
                )
              : null,
            u &&
              a &&
              c().createElement(
                "div",
                { className: t.promptModal },
                c().createElement(
                  "div",
                  { className: t.promptTitle },
                  c().createElement(
                    "div",
                    null,
                    (0, M.vs)("examDetail_tip_info")
                  ),
                  c().createElement("div", {
                    className: t.close,
                    onClick: function() {
                      return i && i(!1);
                    }
                  })
                ),
                c().createElement(
                  "div",
                  { className: t.mes },
                  c().createElement("span", {
                    dangerouslySetInnerHTML: {
                      __html: n || (0, M.vs)("no_data")
                    }
                  })
                )
              )
          );
        }),
        P = n(24145),
        z = (0, l.Z)(w)(function(e) {
          var t = e.classes,
            n = e.currentSubject,
            a = e.onSelectOption,
            i = e.isViewErrorQuestions,
            r = e.currentIndex,
            o = e.answerList,
            l = e.isFromResult,
            u = e.changeViewAnswerTipsState,
            m = e.viewAnswerTips,
            d = e.isOpenAnswer,
            p = (e.setActiveVoiceId, e.disabled),
            A = e.isShowAnswer,
            g = e.isMainTopic,
            f = void 0 === g || g,
            h = P.Z.examStage === I.Bc.errorQuestions && 1 === A,
            v = {
              currentSubject: n,
              onSelectOption: a,
              answerList: o,
              currentIndex: r,
              sectionRespList: n.sectionRespList,
              isViewErrorQuestions: i,
              isFromResult: l,
              disabled: p,
              showAnswerStatus: h
            },
            E = n.questionText,
            x = void 0 === E ? "" : E,
            w = n.image,
            C = void 0 === w ? "" : w,
            T = n.answerTip,
            R = void 0 === T ? "" : T,
            D = n.fileUrl,
            Q = void 0 === D ? "" : D,
            U = n.questionType,
            z = (0, s.useState)(!1),
            W = (0, k.Z)(z, 2),
            Y = W[0],
            G = W[1],
            V = (0, s.useState)(!1),
            J = (0, k.Z)(V, 2),
            K = J[0],
            H = J[1],
            X = "img",
            j = function() {
              "video" === X && H(!Y),
                G(function(e) {
                  return !e;
                });
            },
            _ = function(e) {
              var t = e.split(".");
              return !("mp3" !== t[t.length - 1].toLowerCase() || !(0, N.w1)());
            };
          return c().createElement(
            "div",
            {
              className: t.questionText,
              style: { marginBottom: "".concat(i ? "0" : "30px") }
            },
            c().createElement(
              "div",
              null,
              c().createElement(
                "div",
                {
                  className: y()(
                    (0, b.Z)({}, t.hasResource, !!C && !_(C)),
                    (0, b.Z)({}, t.hasIEResource, !!C && _(C)),
                    t.questionTitle
                  )
                },
                !f &&
                  c().createElement(
                    "span",
                    { className: t.subjectType },
                    I.tX[U || ""]
                  ),
                n.questionType === I.ce.FILL_IN_BLANK
                  ? c().createElement(F, v)
                  : c().createElement(
                      "div",
                      { className: t.flexBlock },
                      "".concat(f ? "" : "\uff08".concat(r + 1, "\uff09")),
                      c().createElement(L.Z, {
                        text: String.raw(q || (q = (0, S.Z)(["", ""])), x),
                        isSpan: !1
                      })
                    )
              ),
              c().createElement(O, {
                isOpenAnswer: d === I.Vq.YES,
                description: R,
                viewAnswerTipsState: m,
                changeViewAnswerTipsState: u,
                fileUrl: Q
              })
            ),
            C &&
              c().createElement(
                "div",
                { style: { width: "".concat(_(C) ? "550px" : "auto") } },
                (function() {
                  var e = C.split("."),
                    n = e[e.length - 1].toLowerCase();
                  return "png" === n || "jpg" === n
                    ? c().createElement(
                        "div",
                        { className: t.videoWrap, style: { width: "270px" } },
                        c().createElement("div", {
                          className: t.image,
                          style: { backgroundImage: "url(".concat(C, ") ") }
                        }),
                        c().createElement("div", {
                          className: t.previewIcon,
                          onClick: j
                        })
                      )
                    : "mp3" === n
                    ? c().createElement(
                        "audio",
                        {
                          controls: !0,
                          controlsList: "nodownload",
                          preload: "auto",
                          style: { width: 270 }
                        },
                        (0, M.vs)("examDetail_not_supported_audio"),
                        c().createElement("source", {
                          type: "audio/mpeg",
                          src: C
                        })
                      )
                    : "mp4" === n
                    ? ((X = "video"),
                      c().createElement(
                        "div",
                        {
                          className: t.videoWrap,
                          onClick: j,
                          style: { width: "270px", height: "152px" }
                        },
                        c().createElement(
                          "div",
                          { className: t.playIcon },
                          c().createElement("div", { className: t.play })
                        ),
                        c().createElement(Z.Z, {
                          className: t.videoPlayer,
                          playUrl: C,
                          pauseVideo: K,
                          controls: !1,
                          width: 270,
                          height: 152
                        })
                      ))
                    : void 0;
                })()
              ),
            c().createElement(B, {
              visible: Y,
              resourceUrl: C,
              type: X,
              closeModal: j
            })
          );
        }),
        W = n(27853),
        Y = n(84531),
        G = n(51937),
        V = n(13094),
        J = n(916),
        K = n(41260),
        H = n(37002);
      !(function(e) {
        (e.PLAY = "play"), (e.ENDED = "ended"), (e.PAUSE = "pause");
      })(Q || (Q = {}));
      var X,
        j,
        _ = { playStatus: Q.PAUSE },
        $ = (function(e) {
          (0, G.Z)(a, e);
          var t = (0, V.Z)(a);
          function a() {
            var e;
            (0, W.Z)(this, a);
            for (var i = arguments.length, r = new Array(i), o = 0; o < i; o++)
              r[o] = arguments[o];
            return (
              ((e = t.call.apply(t, [this].concat(r))).state = _),
              (e.watchStatus = function() {
                var t = document.getElementById(e.props.id);
                t &&
                  (t.addEventListener(
                    "playing",
                    function() {
                      e.setState({ playStatus: Q.PLAY });
                    },
                    !1
                  ),
                  t.addEventListener(
                    "pause",
                    function() {
                      e.setState({ playStatus: Q.PAUSE });
                    },
                    !1
                  ),
                  t.addEventListener(
                    "ended",
                    function() {
                      e.setState({ playStatus: Q.ENDED });
                    },
                    !1
                  ));
              }),
              (e.checkPlay = function(t) {
                if (e.props.voiceUrl) {
                  t.stopPropagation(), (t.cancelBubble = !0);
                  var a = document.getElementById(e.props.id) || null;
                  a && 4 === +a.readyState
                    ? ((a.currentTime = 0),
                      e.props.setActiveVoiceId(e.props.id))
                    : n.g.$message((0, M.vs)("examDetail_voice_loading"));
                } else n.g.$message((0, M.vs)("examDetail_try_later_audio"));
              }),
              (e.onEnded = function() {
                e.setState({ playStatus: Q.ENDED });
              }),
              (e.onPlay = function() {
                e.setState({ playStatus: Q.PLAY });
              }),
              (e.onPause = function() {
                e.setState({ playStatus: Q.PAUSE });
              }),
              (e.getAudio = function(t, n) {
                return t
                  ? c().createElement(
                      "audio",
                      {
                        id: n,
                        controls: !1,
                        onEnded: e.onEnded,
                        onPlay: e.onPlay,
                        onPause: e.onPause,
                        controlsList: "nodownload",
                        preload: "auto",
                        key: n
                      },
                      c().createElement("source", {
                        type: "audio/mpeg",
                        src: t
                      })
                    )
                  : null;
              }),
              e
            );
          }
          return (
            (0, Y.Z)(a, [
              {
                key: "componentDidMount",
                value: function() {
                  this.watchStatus();
                }
              },
              {
                key: "componentWillReceiveProps",
                value: function(e) {
                  var t = this.props,
                    n = t.id;
                  if ("questionVoice" === t.className && n !== e.id) {
                    var a = document.getElementById(n);
                    a && (a.pause(), this.setState({ playStatus: Q.PAUSE }));
                  }
                }
              },
              {
                key: "render",
                value: function() {
                  var e = this,
                    t = this.props,
                    n = t.className,
                    a = t.classes,
                    i = t.voiceUrl,
                    r = t.id,
                    o = t.showText,
                    s = this.state.playStatus;
                  return c().createElement(
                    "div",
                    {
                      className: y()(
                        a["".concat(n)],
                        a.voiceDefault,
                        "".concat(
                          o
                            ? s === Q.PLAY
                              ? a.voiceWrapActive
                              : a.voiceWrap
                            : ""
                        )
                      )
                    },
                    c().createElement(
                      "div",
                      {
                        onClick: function(t) {
                          return e.checkPlay(t);
                        }
                      },
                      c().createElement("span", {
                        className: y()(
                          "voiceIcon",
                          a.voiceIconDefault,
                          "".concat(
                            "questionVoice" === n
                              ? a.voiceIconActive
                              : a.sectionPlace
                          ),
                          "".concat(
                            s === Q.PLAY ? a.sectionActive : a.sectionWrap
                          )
                        )
                      }),
                      o &&
                        c().createElement(
                          "span",
                          { className: a.voiceText },
                          (0, M.vs)("examDetail_voice_reading")
                        ),
                      this.getAudio(i, r)
                    )
                  );
                }
              }
            ]),
            a
          );
        })(s.Component),
        ee = (0, l.Z)(function(e) {
          return (0,
          u.Z)({ voiceDefault: { display: "inline-block", fontSize: "14px", padding: "3px 5px", borderRadius: "2px", "& .voiceIcon": { backgroundSize: "100% 100%", display: "inline-block" }, "&:hover": { "& .voiceIcon": { background: "url(".concat(H, ") no-repeat"), backgroundSize: "100% 100%" } } }, sectionActive: { background: "url(".concat(K, ") no-repeat"), backgroundSize: "100% 100%", "&:hover": { "&.voiceIcon": { background: "url(".concat(K, ") no-repeat"), backgroundSize: "100% 100%" } } }, sectionWrap: { background: "url(".concat(J, ") no-repeat"), backgroundSize: "100% 100%", "&:hover": { "&.voiceIcon": { background: "url(".concat(H, ") no-repeat"), backgroundSize: "100% 100%" } } }, playBackground: { background: "url(".concat(K, ") no-repeat"), backgroundSize: "100% 100%" }, defaultBackground: { background: "url(".concat(J, ") no-repeat"), backgroundSize: "100% 100%" }, voiceIconDefault: { width: 14, height: 14 }, voiceIconActive: { position: "relative", top: "2px" }, sectionPlace: { position: "relative", top: "1px" }, voiceWrap: { border: "1px solid #333333", color: "#333333", "&:hover": { cursor: "pointer", border: "1px solid #1890FF", color: "#1890FF" } }, voiceWrapActive: { border: "1px solid #1890FF", color: "#1890FF", "&:hover": { cursor: "pointer", border: "1px solid #1890FF", color: "#1890FF", "& .voiceIcon": { background: "url(".concat(K, ") no-repeat"), backgroundSize: "100% 100%" } } }, questionVoice: { display: "inline-block", marginBottom: "3px" }, voiceText: { marginLeft: "4px" }, answerVoice: { display: "inline-block", padding: "7px 10px", position: "relative", left: "3px" } });
        })($),
        te = (0, l.Z)(w)(function(e) {
          var t = e.classes,
            n = e.answerList,
            a = e.onSelectOption,
            i = e.sectionRespList,
            r = e.isViewErrorQuestions,
            o = e.currentSubject,
            s = e.disabled,
            l = e.isOpenRead,
            u = e.setActiveVoiceId,
            m = e.showAnswerStatus;
          return c().createElement(
            "div",
            { className: t.options },
            i.map(function(e, i) {
              var d = "Y" === e.isCorrect && m,
                p = (o.myAnswer || []).find(function(t) {
                  return t === e.sectionId;
                }),
                A =
                  n &&
                  n.find(function(t) {
                    return t === e.sectionId;
                  });
              return c().createElement(
                "div",
                {
                  className: y()(
                    t.option,
                    (0, b.Z)({}, t.selectedOption, A),
                    (0, b.Z)({}, t.errorBorderColor, r && p && m),
                    (0, b.Z)({}, t.correctOptions, r && d)
                  ),
                  style: { opacity: s ? 0.5 : 1 },
                  key: e.sectionId,
                  onClick: function() {
                    s ||
                      (a &&
                        a({ sectionId: e.sectionId, childId: e.questionId }));
                  }
                },
                c().createElement(
                  "div",
                  { className: t.flexBlock },
                  "".concat(e.optionNo, "."),
                  c().createElement(L.Z, {
                    text: String.raw(
                      X || (X = (0, S.Z)(["", ""])),
                      e.sectionText
                    ),
                    isSpan: !1
                  })
                ),
                c().createElement(
                  "div",
                  null,
                  r &&
                    d &&
                    c().createElement("div", { className: t.successIcon }),
                  Boolean(l) &&
                    !r &&
                    c().createElement(ee, {
                      setActiveVoiceId: u,
                      voiceUrl: e.voiceUrl || "",
                      id: "voice_".concat(e.sectionId),
                      className: "answerVoice",
                      showText: !1
                    })
                )
              );
            })
          );
        }),
        ne = (0, l.Z)(w)(function(e) {
          var t = e.classes,
            n = (e.currentIndex, e.currentSubject),
            a = e.answerList,
            i = e.onSelectOption,
            r = e.sectionRespList,
            o = e.isViewErrorQuestions,
            s = e.disabled,
            l = e.isOpenRead,
            u = e.setActiveVoiceId,
            m = e.showAnswerStatus;
          return c().createElement(
            "div",
            { className: t.options },
            (r || []).map(function(e, r) {
              var d = "Y" === e.isCorrect && m,
                p = (n.myAnswer || []).find(function(t) {
                  return t === e.sectionId;
                }),
                A =
                  a &&
                  a.find(function(t) {
                    return t === e.sectionId;
                  });
              return c().createElement(
                "div",
                {
                  className: y()(
                    t.option,
                    (0, b.Z)({}, t.selectedOption, A),
                    (0, b.Z)({}, t.errorBorderColor, o && p && m),
                    (0, b.Z)({}, t.correctOptions, o && d)
                  ),
                  key: e.sectionId,
                  style: { opacity: s ? 0.5 : 1 },
                  onClick: function() {
                    s ||
                      (i &&
                        i({ sectionId: e.sectionId, childId: e.questionId }));
                  }
                },
                c().createElement(
                  "div",
                  { className: t.checkBoxWrap },
                  !o &&
                    c().createElement("div", {
                      className: A ? t.checkedBox : t.checkBox
                    }),
                  c().createElement(
                    "div",
                    {
                      className: ""
                        .concat(t.flexContainer, " ")
                        .concat(t.flexBlock)
                    },
                    "".concat(e.optionNo, "."),
                    c().createElement(L.Z, {
                      text: String.raw(
                        j || (j = (0, S.Z)(["", ""])),
                        e.sectionText
                      )
                    })
                  )
                ),
                o &&
                  d &&
                  c().createElement("div", { className: t.successIcon }),
                Boolean(l) &&
                  !o &&
                  c().createElement(ee, {
                    setActiveVoiceId: u,
                    voiceUrl: e.voiceUrl || "",
                    id: "voice_".concat(e.sectionId),
                    className: "answerVoice",
                    showText: !1
                  })
              );
            })
          );
        }),
        ae = n(65658),
        ie = n(84322),
        re = n.n(ie),
        oe = n(33032),
        se = n(10522),
        ce = n(58971),
        le = n.n(ce),
        ue = n(66045),
        me = n(73914),
        de = n(56673),
        pe = (0, me.Z)(function(e) {
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
                  background: e.palette.primary.main,
                  height: "100%"
                }
              },
              "& .percent": { fontSize: "14px", marginLeft: "10px" }
            }
          };
        }),
        Ae = function(e) {
          return c().createElement(
            "div",
            { className: pe().progressWrapper },
            c().createElement(
              "div",
              { className: "progress-body" },
              c().createElement("div", {
                className: "progress",
                style: { width: e.percent }
              })
            ),
            c().createElement("div", { className: "percent" }, e.percent)
          );
        },
        ge = (0, me.Z)(function(e) {
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
              "&:hover": { backgroundColor: "#F5F5F5" }
            },
            img: { marginRight: 5 },
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
              "&:hover": { backgroundColor: "#ffffff" }
            },
            progress: { flex: 1 },
            operate: {
              padding: "0 20px",
              cursor: "pointer",
              "&:hover": { color: e.palette.primary.main }
            },
            operateText: { padding: "0 20px" },
            disabled: {
              opacity: 0.5,
              cursor: "not-allowed",
              "&:hover": { color: "#666666" }
            }
          };
        }),
        fe = function(e) {
          var t = e.filename,
            n = e.progress,
            a = void 0 === n ? "" : n,
            i = e.onDelete,
            r = e.onDownload,
            o = e.isHeader,
            s = void 0 !== o && o,
            l = e.disabled,
            u = void 0 !== l && l,
            m = e.uploading,
            d = void 0 !== m && m,
            p = ge();
          return s
            ? c().createElement(
                "li",
                { className: y()(p.row, p.header) },
                c().createElement("div", { className: p.name }, t),
                c().createElement("div", { className: p.progress }),
                c().createElement(
                  "div",
                  { className: p.operateText },
                  (0, M.vs)("operation")
                )
              )
            : c().createElement(
                "li",
                { className: p.row },
                c().createElement("img", {
                  src: de,
                  alt: "",
                  width: "14",
                  height: "14",
                  className: p.img
                }),
                c().createElement("div", { className: p.name, onClick: r }, t),
                c().createElement(
                  "div",
                  { className: p.progress },
                  d && a ? c().createElement(Ae, { percent: a }) : null
                ),
                c().createElement(
                  "div",
                  { className: y()(p.operate, u && p.disabled), onClick: i },
                  d
                    ? null
                    : c().createElement("span", null, (0, M.vs)("delete"))
                )
              );
        },
        he = function(e) {
          var t = e.fileList,
            n = e.onDel,
            a = e.disabled,
            i = e.previewAble,
            r = function(e) {
              var t = e.lastIndexOf("."),
                n = e.slice(t - 1);
              return e.length > 25
                ? "".concat(e.slice(0, 15), "...").concat(n)
                : e;
            };
          return !t || (0, R.isEmpty)(t)
            ? null
            : c().createElement(
                "ul",
                null,
                c().createElement(fe, {
                  filename: (0, M.vs)("enclosure_title"),
                  isHeader: !0
                }),
                t.map(function(e, t) {
                  return c().createElement(fe, {
                    key: t,
                    filename: r(e.fileName),
                    disabled: a,
                    onDelete: function() {
                      return n(t);
                    },
                    onDownload: function() {
                      return (
                        (t = e.filePath),
                        void (
                          i &&
                          window.open("".concat(U.dM.API_PREFIX, "/").concat(t))
                        )
                      );
                      var t;
                    },
                    progress: e.progress,
                    uploading: e.uploading
                  });
                })
              );
        },
        ve = n(98544),
        Ee = (function() {
          var e = (0, oe.Z)(
            re().mark(function e(t, n, a) {
              return re().wrap(function(e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return e.abrupt(
                        "return",
                        se.Z.post(
                          t,
                          { file: n },
                          {
                            headers: {
                              "Content-Type": "multipart/form-data",
                              sid: le().get("sessionInfo").sid,
                              appDevicePlatform: U.dM.STR_OS
                            },
                            timeout: 6e4,
                            onUploadProgress: a
                          }
                        )
                      );
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function(t, n, a) {
            return e.apply(this, arguments);
          };
        })(),
        xe = function(e) {
          var t = e.split(".");
          return t[t.length - 1].toLocaleLowerCase();
        },
        we = {
          fileList: [],
          loading: !1,
          showDel: 0,
          width: "0",
          uploadingIndex: -1,
          visible: !1
        },
        Ie = (function(e) {
          (0, G.Z)(a, e);
          var t = (0, V.Z)(a);
          function a() {
            var e;
            (0, W.Z)(this, a);
            for (var i = arguments.length, r = new Array(i), s = 0; s < i; s++)
              r[s] = arguments[s];
            return (
              ((e = t.call.apply(t, [this].concat(r))).state = we),
              (e.inputRef = null),
              (e.onDel = function(t) {
                if (!e.props.disabled) {
                  var n = e.state.fileList.filter(function(e, n) {
                    return n !== t;
                  });
                  e.setState({ fileList: n }), e.props.onChange(n);
                }
              }),
              (e.onInputChange = function() {
                var t = e.props.limit;
                e.state.fileList.length >= t
                  ? e.setState({ visible: !0 })
                  : e.inputRef && e.inputRef.click();
              }),
              (e.resetInputValue = function() {
                e.inputRef && (e.inputRef.value = "");
              }),
              (e.listenProgress = function(t) {
                var n = t.total,
                  a = t.loaded;
                if (t.lengthComputable) {
                  var i = "".concat(((100 * a) / n).toFixed(0), "%");
                  e.updateFileList({ progress: i });
                }
              }),
              (e.validateParam = function(t) {
                var a = e.props,
                  i = a.validate,
                  r = a.acceptPostfix,
                  o = a.limitSize,
                  s = a.limit;
                if (i) return i(t);
                var c = e.state.fileList;
                return [].concat((0, ae.Z)(t), (0, ae.Z)(c)).length > s
                  ? (e.setState({ visible: !0 }), !1)
                  : !t.some(function(e) {
                      return r.includes(xe(e.name))
                        ? 0 === e.size
                          ? (n.g.$message(
                              (0, M.vs)("components_upload_files_empty")
                            ),
                            !0)
                          : !!(e.size / 1048576 >= o) &&
                            (n.g.$message(
                              (0, M.vs)("components_upload_files_empty", {
                                limitSize: o
                              })
                            ),
                            !0)
                        : (n.g.$message((0, M.vs)("not_support_upload")), !0);
                    });
              }),
              (e.setLoading = function(t) {
                return e.setState({ loading: t });
              }),
              (e.updateFileList = function(t) {
                var n =
                    arguments.length > 1 &&
                    void 0 !== arguments[1] &&
                    arguments[1],
                  a = e.state,
                  i = a.fileList,
                  r = a.uploadingIndex,
                  s = (0, o.Z)((0, o.Z)({}, i[r]), t),
                  c = i.slice();
                c.splice(r, 1, s),
                  e.setState({ fileList: c }),
                  n && e.props.onChange(c);
              }),
              (e.onChange = (function() {
                var t = (0, oe.Z)(
                  re().mark(function t(a) {
                    var i, r, o, s, c, l, u, m, d, p, A, g, f;
                    return re().wrap(
                      function(t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              if (
                                ((i = a.currentTarget),
                                (r = e.props.action),
                                !(
                                  i &&
                                  i.files &&
                                  i.files.length &&
                                  i.files.length > 0
                                ))
                              ) {
                                t.next = 47;
                                break;
                              }
                              if (
                                ((o = Array.from(i.files)), e.validateParam(o))
                              ) {
                                t.next = 7;
                                break;
                              }
                              return e.resetInputValue(), t.abrupt("return");
                            case 7:
                              (s = o.map(function(e) {
                                return {
                                  filePath: "",
                                  fileName: e.name,
                                  fileType: e.type,
                                  uploading: !0,
                                  progress: "0%"
                                };
                              })),
                                (c = e.state.fileList),
                                (l = c.length),
                                e.setState({
                                  fileList: [].concat(
                                    (0, ae.Z)(c),
                                    (0, ae.Z)(s)
                                  )
                                }),
                                (u = 0);
                            case 12:
                              if (!(u < o.length)) {
                                t.next = 47;
                                break;
                              }
                              return (
                                (m = o[u]),
                                e.props.isUniqueUpload && e.resetInputValue(),
                                (d = new FormData()).append("file", m),
                                n.g.$showLoading(!0),
                                e.setLoading(!0),
                                (t.prev = 19),
                                e.setState({ uploadingIndex: l + u }),
                                (t.next = 23),
                                Ee(r, d, e.listenProgress)
                              );
                            case 23:
                              if (0 === +(p = t.sent).code) {
                                t.next = 33;
                                break;
                              }
                              return (
                                n.g.$message(p.message),
                                n.g.$showLoading(!1),
                                (A = e.state.fileList.slice()).splice(l + u, 1),
                                (l -= 1),
                                e.setState({ loading: !1, fileList: A }),
                                e.props.onChange(A),
                                t.abrupt("continue", 44)
                              );
                            case 33:
                              (g = { filePath: p.body, uploading: !1 }),
                                e.updateFileList(g, !0),
                                n.g.$showLoading(!1),
                                e.setState({ loading: !1 }),
                                (t.next = 43);
                              break;
                            case 39:
                              (t.prev = 39),
                                (t.t0 = t.catch(19)),
                                (f = t.t0.message.includes("timeout")
                                  ? (0, M.vs)("components_upload_time_out")
                                  : (0, M.vs)("components_net_error")),
                                n.g.$message(f);
                            case 43:
                              e.setState({ width: "0", loading: !1 });
                            case 44:
                              u++, (t.next = 12);
                              break;
                            case 47:
                            case "end":
                              return t.stop();
                          }
                      },
                      t,
                      null,
                      [[19, 39]]
                    );
                  })
                );
                return function(e) {
                  return t.apply(this, arguments);
                };
              })()),
              e
            );
          }
          return (
            (0, Y.Z)(
              a,
              [
                {
                  key: "render",
                  value: function() {
                    var e = this,
                      t = this.props,
                      n = t.disabled,
                      a = void 0 !== n && n,
                      i = t.multiple,
                      r = void 0 !== i && i,
                      o = t.label,
                      s = t.classes,
                      l = t.accept,
                      u = t.limit,
                      m = t.previewAble,
                      d = this.state,
                      p = d.loading,
                      A = d.visible,
                      g = d.fileList,
                      f = void 0 === g ? [] : g;
                    return c().createElement(
                      c().Fragment,
                      null,
                      c().createElement(
                        "section",
                        { className: s.fileContainer },
                        c().createElement(
                          "aside",
                          { className: s.upload },
                          c().createElement(
                            "div",
                            {
                              onClick: this.onInputChange,
                              className: y()(s.uploadBtn, a && s.disabled)
                            },
                            c().createElement(
                              "span",
                              null,
                              p ? (0, M.vs)("components_uploading") : o
                            )
                          ),
                          c().createElement("input", {
                            ref: function(t) {
                              return (e.inputRef = t);
                            },
                            type: "file",
                            id: "upload",
                            onChange: this.onChange,
                            accept: l,
                            disabled: a || p,
                            multiple: r
                          })
                        )
                      ),
                      c().createElement(
                        "section",
                        null,
                        c().createElement(he, {
                          fileList: f,
                          onDel: this.onDel,
                          disabled: a,
                          previewAble: m
                        })
                      ),
                      c().createElement(ue.Z, {
                        showClose: !1,
                        onOk: function() {
                          e.setState({ visible: !1 });
                        },
                        visible: A,
                        content: (0, M.vs)("components_uploadNumLimit", {
                          limit: u
                        }),
                        confirmAndCancel: !1,
                        okText: (0, M.vs)("i_got_it")
                      })
                    );
                  }
                }
              ],
              [
                {
                  key: "getDerivedStateFromProps",
                  value: function(e, t) {
                    return !t.fileList || (0, R.isEmpty)(t.fileList)
                      ? { fileList: e.fileList }
                      : null;
                  }
                }
              ]
            ),
            a
          );
        })(c().PureComponent);
      Ie.defaultProps = {
        fileList: [],
        acceptPostfix: ["jpeg", "jpg", "png"],
        limitSize: 5,
        limit: 9,
        multiple: !0,
        isUniqueUpload: !0,
        previewAble: !1
      };
      var be,
        Se = (0, l.Z)(function(e) {
          return (0,
          u.Z)({ fileContainer: { display: "flex", marginTop: "10px", marginBottom: "8px", fontSize: "14px", color: "#4E8FFF", "& .upload": { width: 109, color: "#333333", textAlign: "right" } }, upload: { position: "relative", fontSize: "14px", color: "#666", "& input": { cursor: "pointer", width: 106, height: 0, position: "absolute", left: 0, top: 0, opacity: 0, zIndex: 0 }, "& p": { fontSize: 12, color: "#CCCCCC" } }, box: { backgroundColor: e.palette.secondary.main, border: "1px solid #D9D9D9", borderRadius: 4, zIndex: 1, width: 104, height: 30, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, cursor: "pointer", "& i": { display: "block", width: 14, height: 14, background: "url(".concat(ve, ") no-repeat 0 0/14px 14px"), marginRight: 8 } }, uploadBtn: { backgroundColor: e.palette.primary.main, color: e.palette.secondary.main, borderRadius: 2, zIndex: 1, padding: "0 5px", height: 32, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, cursor: "pointer" }, disabled: { opacity: 0.5, cursor: "not-allowed" } });
        })(Ie);
      !(function(e) {
        (e[(e.CLOSE = 0)] = "CLOSE"), (e[(e.OPEN = 1)] = "OPEN");
      })(be || (be = {}));
      var ke = (0, l.Z)(w)(function(e) {
          var t = e.classes,
            n = e.currentSubject,
            a = e.onSelectOption,
            i = e.isViewErrorQuestions,
            r = e.answerList,
            o = e.isFromResult,
            l = e.isPhotoAnswer,
            u = e.images,
            m = void 0 === u ? [] : u,
            d = e.disabled,
            p = e.showAnswerStatus,
            A = (0, s.useState)([]),
            g = (0, k.Z)(A, 2),
            f = g[0],
            h = g[1],
            v = (0, s.useState)("#F5F5F5"),
            E = (0, k.Z)(v, 2),
            x = E[0],
            w = E[1],
            I = (0, s.useState)("#B2B2B2"),
            b = (0, k.Z)(I, 2),
            S = b[0],
            C = b[1],
            y = n.keyword,
            N = n.myAnswer,
            T = (0, s.useState)(i ? "" : r && r.length > 0 ? r[0] : ""),
            Z = (0, k.Z)(T, 2),
            B = Z[0],
            R = Z[1];
          (0, s.useEffect)(function() {
            var e = m.map(function(e) {
              var t = e,
                n = e.lastIndexOf("/");
              return {
                filePath: t,
                fileType: "image/jpg",
                fileName: e.substring(n + 1)
              };
            });
            h(e),
              (document.oncontextmenu = function(e) {
                e.preventDefault();
              }),
              (document.onselectstart = function(e) {
                e.preventDefault();
              }),
              (document.onpaste = function() {
                return !1;
              }),
              (document.oncopy = function() {
                return !1;
              }),
              (document.oncut = function() {
                return !1;
              });
          }, []);
          var D = (0, s.useCallback)(
              function() {
                if ((w(B ? "#FFFFFF" : "#F5F5F5"), a)) {
                  var e = f.map(function(e) {
                    return e.filePath;
                  });
                  a({ sectionId: B, childId: n.questionId }, void 0, e);
                }
              },
              [B]
            ),
            L = (0, s.useCallback)(function() {
              return w("#FFFFFF");
            }, []);
          return c().createElement(
            "div",
            { className: t.questionAndAnswer },
            i
              ? c().createElement(
                  "div",
                  null,
                  o && p
                    ? c().createElement(
                        c().Fragment,
                        null,
                        c().createElement(
                          "div",
                          { className: t.myAnswerTitle },
                          (0, M.vs)("examDetail_my_answers")
                        ),
                        c().createElement("div", {
                          className: t.myAnswerBox,
                          style: { paddingBottom: "14px" },
                          dangerouslySetInnerHTML: {
                            __html: (function(e, t) {
                              return e.replace(
                                "".concat(t, "/g"),
                                "<span style={ color='#52C41A'}>".concat(
                                  t,
                                  "</span>"
                                )
                              );
                            })(
                              (N && N[0]) || (0, M.vs)("examDetail_no_answer"),
                              y || ""
                            )
                          }
                        })
                      )
                    : c().createElement("div", { className: t.myAnswerBox }),
                  c().createElement(
                    "div",
                    { className: t.referAnswerTitle },
                    (0, M.vs)("examDetail_reference_answer_colon")
                  ),
                  c().createElement(
                    "div",
                    { className: t.referAnswer },
                    n.referAnswer
                      ? c().createElement("div", {
                          dangerouslySetInnerHTML: {
                            __html: n.referAnswer.replace(/\n/g, "<br/>")
                          }
                        })
                      : null
                  )
                )
              : c().createElement(
                  c().Fragment,
                  null,
                  c().createElement(
                    "div",
                    {
                      className: t.textareaWrap,
                      style: { backgroundColor: x }
                    },
                    c().createElement("textarea", {
                      placeholder: d
                        ? ""
                        : zn_t_intelligent_portal(
                            "42a26db5",
                            "\u8bf7\u5728\u6b64\u8f93\u5165\u7b54\u6848"
                          ),
                      className: t.questionInput,
                      onChange: function(e) {
                        var t = e.target.value || "";
                        t.length >= 1e3 && C("#FA534A"),
                          t.match(/[@]/g) || R(t);
                      },
                      maxLength: 1e3,
                      value: B,
                      onFocus: L,
                      onBlur: D,
                      disabled: d
                    }),
                    c().createElement(
                      "div",
                      { className: t.answerLength },
                      c().createElement(
                        "span",
                        { style: { color: S } },
                        B.length,
                        "/1000"
                      )
                    )
                  ),
                  (l === be.OPEN &&
                    c().createElement(
                      c().Fragment,
                      null,
                      c().createElement(
                        "p",
                        { className: t.tip },
                        (0, M.vs)("examDetail_uploadImageTip")
                      ),
                      c().createElement(Se, {
                        label: (0, M.vs)("examDetail_uploadImage"),
                        accept: "image/jpeg,image/jpg,image/png",
                        onChange: function(e) {
                          var t = e.map(function(e) {
                            return e.filePath;
                          });
                          h(e),
                            a &&
                              a(
                                { sectionId: B, childId: n.questionId },
                                void 0,
                                t
                              );
                        },
                        fileList: f,
                        disabled: d,
                        previewAble: !0,
                        action: "/learn/app/clientapi/exam/new/uploadImage.do"
                      })
                    )) ||
                    null
                )
          );
        }),
        Ce = n(46772),
        ye = (0, l.Z)(w)(function(e) {
          var t = e.classes,
            n = (e.currentIndex, e.currentSubject),
            a = e.answerList,
            i = e.onSelectOption,
            r = e.sectionRespList,
            o = e.isViewErrorQuestions,
            l = e.disabled,
            u = e.showAnswerStatus,
            m = (0, s.useState)(!1),
            d = (0, k.Z)(m, 2),
            p = d[0],
            A = d[1],
            g = (0, s.useState)(""),
            f = (0, k.Z)(g, 2),
            h = f[0],
            v = f[1];
          return c().createElement(
            "div",
            { className: y()(t.options, t.imageOptions) },
            (r || []).map(function(e, r) {
              var s = "Y" === e.isCorrect && u,
                m = (n.myAnswer || []).find(function(t) {
                  return t === e.sectionId;
                }),
                d =
                  a &&
                  a.find(function(t) {
                    return t === e.sectionId;
                  });
              return c().createElement(
                "div",
                { key: e.sectionId },
                c().createElement(
                  "div",
                  {
                    className: y()(
                      t.imgQuestionWrap,
                      (0, b.Z)({}, t.selectedOption, d)
                    ),
                    style: { opacity: l ? 0.5 : 1 },
                    onClick: function() {
                      l || (i && i(e.sectionId));
                    }
                  },
                  c().createElement(
                    "div",
                    {
                      className: y()(
                        t.imgWrap,
                        (0, b.Z)({}, t.selectedImage, d),
                        (0, b.Z)({}, t.errorBorderColor, o && m && u),
                        (0, b.Z)({}, t.correctBorderColor, o && s)
                      )
                    },
                    c().createElement("div", {
                      className: t.previewIcon,
                      onClick: function(t) {
                        return (function(e, t) {
                          e.stopPropagation(), v(t), A(!0);
                        })(t, e.resourceUrl);
                      }
                    }),
                    c().createElement("img", {
                      className: t.imgAnswer,
                      src: e.resourceUrl,
                      onError: function(e) {
                        return (function(e) {
                          e.target.src = Ce;
                        })(e);
                      }
                    })
                  ),
                  c().createElement("div", { className: t.imgNum }, e.optionNo)
                )
              );
            }),
            c().createElement(B, {
              visible: p,
              resourceUrl: h,
              type: "img",
              closeModal: function() {
                return A(!1);
              }
            })
          );
        }),
        Ne = n(33146),
        Te = n(53655),
        Ze = n(45342),
        Be = n(88683),
        Re = (function(e) {
          (0, G.Z)(n, e);
          var t = (0, V.Z)(n);
          function n(e) {
            var a;
            return (
              (0, W.Z)(this, n),
              ((a = t.call(this, e)).setList = (function() {
                var e = (0, oe.Z)(
                  re().mark(function e(t) {
                    var n, i, r, o, s, c, l;
                    return re().wrap(function(e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              t.map(function(e) {
                                (e.rightAnswer = []), (e.status = "");
                              }),
                              (e.next = 3),
                              a.setState({
                                listLeft: D().sortBy(
                                  t.filter(function(e) {
                                    return "b" !== e.ligatureType;
                                  }),
                                  "sortNo"
                                ),
                                listRight: D().sortBy(
                                  t.filter(function(e) {
                                    return "a" !== e.ligatureType;
                                  }),
                                  "sortNo"
                                )
                              })
                            );
                          case 3:
                            (n = a.state),
                              (i = n.lineArr),
                              (r = n.listLeft),
                              (o = n.listRight),
                              (s = a.props.answerList) &&
                                s.length > 0 &&
                                (s.forEach(function(e) {
                                  r.map(function(t) {
                                    return (
                                      t.sectionId === e.split(":")[0] &&
                                      t.rightAnswer.push(e.split(":")[1])
                                    );
                                  });
                                }),
                                (c = document.getElementsByClassName(
                                  "lineTop"
                                )[0]),
                                (l = c.offsetTop),
                                s.forEach(function(e) {
                                  var t = r.findIndex(function(t) {
                                      return t.sectionId === e.split(":")[0];
                                    }),
                                    n = o.findIndex(function(t) {
                                      return t.sectionId === e.split(":")[1];
                                    }),
                                    a = document.getElementsByClassName(
                                      "lOption"
                                    )[t],
                                    s = document.getElementsByClassName(
                                      "rOption"
                                    )[n],
                                    c = a.offsetTop,
                                    u = a.offsetHeight,
                                    m = s.offsetTop,
                                    d = s.offsetHeight;
                                  i.push({
                                    left: c - l + u / 2,
                                    right: m - l + d / 2,
                                    leftSectionId: e.split(":")[0],
                                    rightSectionId: e.split(":")[1],
                                    view: !0
                                  });
                                })),
                              a.setState({ lineArr: i, listLeft: r }),
                              a.createCanvas(i),
                              a.operateStatus("create");
                          case 9:
                          case "end":
                            return e.stop();
                        }
                    }, e);
                  })
                );
                return function(t) {
                  return e.apply(this, arguments);
                };
              })()),
              (a.createCanvas = function(e) {
                var t = document.getElementById("drawing"),
                  n = document.getElementsByClassName("lineTop")[0]
                    .offsetHeight;
                t && 150 === t.height && (t.height = n);
                var a = t.getContext("2d");
                if (a) {
                  if ((a.clearRect(0, 0, 160, t.height), 0 === e.length))
                    return;
                  e.forEach(function(e) {
                    (a.strokeStyle = "#A7D5FF"),
                      (a.lineWidth = 2),
                      a.beginPath(),
                      a.moveTo(0, e.left),
                      e.right && a.lineTo(160, e.right),
                      a.stroke();
                  });
                }
              }),
              (a.clearCanvas = function() {
                var e = document.getElementById("drawing"),
                  t = e.getContext("2d");
                t && t.clearRect(0, 0, 160, e.height);
              }),
              (a.handle = function(e, t, n) {
                var i = a.state,
                  r = i.listLeft,
                  o = i.lineArr;
                if (
                  ("left" === n &&
                    (a.createArr(e, t, n), a.setListStatus(t, n)),
                  "right" === n)
                ) {
                  if (
                    0 !== o.length &&
                    (o[o.length - 1].view || o[o.length - 1].right)
                  )
                    return;
                  0 !== o.length &&
                    o[o.length - 1].left &&
                    r.forEach(function(i) {
                      i.sectionId === o[o.length - 1].leftSectionId &&
                        (i.rightAnswer.find(function(t) {
                          return t === e.sectionId;
                        }) ||
                          (i.rightAnswer.push(e.sectionId),
                          a.createArr(e, t, n),
                          a.setListStatus(t, n),
                          a.setAnswer()));
                    });
                }
              }),
              (a.setAnswer = function() {
                var e = a.state.lineArr,
                  t = [];
                e.forEach(function(e) {
                  e.rightSectionId &&
                    t.push(
                      "".concat(e.leftSectionId, ":").concat(e.rightSectionId)
                    );
                }),
                  a.props.onSelectOption &&
                    a.props.onSelectOption("", [], [], t);
              }),
              (a.createArr = function(e, t, n) {
                var i = a.state.lineArr,
                  r = document.getElementsByClassName("lineTop")[0],
                  o = document.getElementsByClassName(
                    "".concat("left" === n ? "lOption" : "rOption")
                  )[t],
                  s = r.offsetTop,
                  c = o.offsetTop,
                  l = o.offsetHeight;
                "left" === n &&
                  (0 === i.length || i[i.length - 1].right
                    ? i.push({
                        left: c - s + l / 2,
                        leftSectionId: e.sectionId,
                        right: 0,
                        rightSectionId: "",
                        view: !1
                      })
                    : ((i[i.length - 1].left = c - s + l / 2),
                      (i[i.length - 1].leftSectionId = e.sectionId))),
                  "right" === n &&
                    ((i[i.length - 1].right = c - s + l / 2),
                    (i[i.length - 1].rightSectionId = e.sectionId)),
                  a.setState({ lineArr: i });
              }),
              (a.setListStatus = function(e, t) {
                var n = a.state,
                  i = n.listLeft,
                  r = n.listRight,
                  o = n.lineArr;
                "left" === t &&
                  i.map(function(t, n) {
                    return (t.status =
                      e === n
                        ? t.rightAnswer.length > 0
                          ? "clickConnect"
                          : "click"
                        : t.rightAnswer.length > 0
                        ? "connect"
                        : "");
                  }),
                  "right" === t &&
                    (i.map(function(e) {
                      return (e.status =
                        "clickConnect" === e.status || "click" === e.status
                          ? "connect"
                          : e.status);
                    }),
                    a.createCanvas(o),
                    a.setRightStatus()),
                  a.setState({ listLeft: i, listRight: r });
              }),
              (a.cancel = (0, oe.Z)(
                re().mark(function e() {
                  var t, n, i, r, o, s;
                  return re().wrap(function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          (t = a.state),
                            (n = t.listLeft),
                            (i = t.lineArr),
                            (r = i.pop()) &&
                              (r.rightSectionId ||
                                ((o = r), (r = i.pop()), i.push(o)),
                              (s = n.findIndex(function(e) {
                                return e.sectionId === r.leftSectionId;
                              })),
                              (n[s].rightAnswer = n[s].rightAnswer.filter(
                                function(e) {
                                  return e !== r.rightSectionId;
                                }
                              )),
                              a.setState({ listLeft: n }, function() {
                                a.operateStatus("cancel", s), a.createCanvas(i);
                              }));
                        case 3:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )),
              (a.operateStatus = function(e, t) {
                var n = a.state,
                  i = n.listLeft,
                  r = n.listRight,
                  o = n.lineArr;
                "cancel" === e &&
                  (0 === i[t || 0].rightAnswer.length &&
                    (i[t || 0].status =
                      "clickConnect" === i[t || 0].status ? "click" : ""),
                  a.setRightStatus(),
                  a.setAnswer()),
                  "clear" === e &&
                    ((o.length = 0),
                    a.createCanvas(o),
                    r.map(function(e) {
                      return (e.status = "");
                    }),
                    i.map(function(e) {
                      (e.rightAnswer = []), (e.status = "");
                    }),
                    a.setAnswer()),
                  "create" === e &&
                    (i.map(function(e) {
                      return (e.status =
                        e.rightAnswer && e.rightAnswer.length > 0
                          ? "connect"
                          : "");
                    }),
                    a.setRightStatus()),
                  a.setState({ listLeft: i, listRight: r });
              }),
              (a.setRightStatus = function() {
                var e = a.state,
                  t = e.listLeft,
                  n = e.listRight,
                  i = [];
                t.forEach(function(e) {
                  i = i.concat(e.rightAnswer);
                }),
                  (i = (0, ae.Z)(new Set(i))),
                  n.map(function(e) {
                    var t = i.findIndex(function(t) {
                      return e.sectionId === t;
                    });
                    return (e.status = -1 === t ? "" : "connect");
                  }),
                  a.setState({ listRight: n });
              }),
              (a.state = {
                listLeft: [],
                listRight: [],
                lineArr: [],
                visible: !1
              }),
              a
            );
          }
          return (
            (0, Y.Z)(n, [
              {
                key: "componentDidMount",
                value: function() {
                  this.setList(this.props.sectionRespList);
                }
              },
              {
                key: "componentWillUnmount",
                value: function() {
                  this.clearCanvas();
                }
              },
              {
                key: "render",
                value: function() {
                  var e = this,
                    t = this.state,
                    n = t.listLeft,
                    a = t.listRight,
                    i = t.lineArr,
                    r = t.visible,
                    o = this.props,
                    s = o.classes,
                    l = o.disabled,
                    u = o.setOperateVisible,
                    m = o.currentLength;
                  return c().createElement(
                    "div",
                    { className: s.lineOptions },
                    c().createElement(
                      "div",
                      {
                        className: ""
                          .concat(s.lineOperate, " ")
                          .concat(l ? s.op0 : "")
                      },
                      c().createElement(
                        "div",
                        {
                          className: ""
                            .concat(s.operateBtn, " ")
                            .concat(l || 0 === i.length ? "" : s.canUse),
                          onClick: function() {
                            l ||
                              (0 !== i.length &&
                                (e.setState({ visible: !0 }), u(!0)));
                          }
                        },
                        c().createElement("span", null),
                        c().createElement("span", { className: s.dn }),
                        c().createElement(
                          "div",
                          { className: s.operateText },
                          (0, M.vs)("examDetail_clean_up")
                        )
                      ),
                      c().createElement(
                        "div",
                        {
                          className: ""
                            .concat(s.operateBtn, " ")
                            .concat(
                              l || 0 === i.length || !i[0].right ? "" : s.canUse
                            ),
                          onClick: function() {
                            l ||
                              (0 !== i.length &&
                                i[0].rightSectionId &&
                                e.cancel());
                          }
                        },
                        c().createElement("span", { className: s.dn }),
                        c().createElement("span", null),
                        c().createElement(
                          "div",
                          { className: s.operateText },
                          (0, M.vs)("examDetail_revoke")
                        )
                      )
                    ),
                    c().createElement(
                      "div",
                      { className: s.lineTips },
                      (0, M.vs)("examDetail_lineTips")
                    ),
                    c().createElement(
                      "div",
                      { className: s.lineContent },
                      c().createElement(
                        "div",
                        { className: "".concat(s.lineLeft, " lineTop") },
                        n.map(function(t, n) {
                          return c().createElement(
                            "div",
                            {
                              key: t.sectionId,
                              className: ""
                                .concat(s.lineOption, "\n                    ")
                                .concat(
                                  t.status ? s[t.status] : "",
                                  "\n                    "
                                )
                                .concat(l ? s.opacity : "", " lOption"),
                              onClick: function() {
                                l || e.handle(t, n, "left");
                              }
                            },
                            t.sectionText
                          );
                        })
                      ),
                      c().createElement(
                        "div",
                        { className: s.lineCanvas },
                        c().createElement("canvas", {
                          id: "drawing",
                          width: "160"
                        })
                      ),
                      c().createElement(
                        "div",
                        { className: s.lineRight },
                        a.map(function(t, n) {
                          return c().createElement(
                            "div",
                            {
                              key: t.sectionId,
                              className: ""
                                .concat(s.lineOption, "\n                    ")
                                .concat(
                                  "connect" === t.status ? s.connect : "",
                                  "\n                    "
                                )
                                .concat(l ? s.opacity : "", " rOption"),
                              onClick: function() {
                                l || e.handle(t, n, "right");
                              }
                            },
                            t.sectionText
                          );
                        })
                      )
                    ),
                    1 === m && c().createElement("div", { className: s.h188 }),
                    r &&
                      c().createElement(ue.Z, {
                        onOk: function() {
                          e.setState({ visible: !1 }),
                            u(!1),
                            e.setAnswer(),
                            setTimeout(function() {
                              e.props.disabled || e.operateStatus("clear");
                            }, 0);
                        },
                        onCancel: function() {
                          e.setState({ visible: !1 }), u(!1), e.setAnswer();
                        },
                        okText: (0, M.vs)("confirm"),
                        visible: r,
                        confirmAndCancel: !0,
                        content: c().createElement(
                          "div",
                          { className: this.props.classes.clearTip },
                          (0, M.vs)("examDetail_clearTip")
                        )
                      })
                  );
                }
              }
            ]),
            n
          );
        })(s.Component),
        De = (0, l.Z)(function(e) {
          return (0,
          u.Z)({ lineOptions: { marginTop: 10, width: "100%" }, lineOperate: { display: "flex", justifyContent: "flex-end" }, operateBtn: { width: 68, height: 28, color: "#999", cursor: "pointer", display: "flex", alignItems: "center", borderRadius: 2, border: "1px solid #CCC", justifyContent: "center", backgroundColor: "#fff", marginLeft: 20, "& span:nth-child(1)": { width: 16, height: 16, backgroundImage: "url(".concat(Ne, ")"), backgroundSize: "16px 16px" }, "& span:nth-child(2)": { width: 16, height: 16, backgroundImage: "url(".concat(Ze, ")"), backgroundSize: "16px 16px" } }, clearTip: { marginBottom: 40, fontSize: 22, textAlign: "center", lineHeight: "30px", padding: "0 70px 0 70px !important" }, canUse: { "&:hover": { color: "#666", border: "1px solid #999", "& span:nth-child(1)": { backgroundImage: "url(".concat(Te, ")") }, "& span:nth-child(2)": { backgroundImage: "url(".concat(Be, ")") } } }, dn: { display: "none" }, operateText: { fontSize: 14, marginLeft: 4 }, lineTips: { fontSize: 14, color: "#999", marginTop: -23, marginBottom: 28, margin: "-23px 0 28px 0", width: "80%" }, lineContent: { display: "flex", flexWrap: "wrap", justifyContent: "space-between" }, lineLeft: { width: 330 }, lineCanvas: { width: 160, height: "100%" }, lineRight: { width: 330 }, lineOption: { width: 308, height: 48, lineHeight: "50px", paddingLeft: 20, marginBottom: 10, cursor: "pointer", color: "#333", fontSize: 14, background: "#fff", borderRadius: 2, border: "1px solid #ccc" }, click: { color: "#1890FF", border: "1px solid #1890FF" }, connect: { color: "#1890FF", border: "1px solid #fff", background: "#F3F9FF" }, clickConnect: { color: "#1890FF", border: "1px solid  #1890FF", background: "#F3F9FF" }, opacity: { opacity: 0.5 }, op0: { opacity: 0 }, h188: { height: 188 } });
        })(Re),
        Le = (0, M.vs)("examDetail_limitTip", { limit: 3 }, 1),
        qe = (0, l.Z)(w)(function(e) {
          var t = e.classes,
            a = e.disabled,
            i = void 0 !== a && a,
            r = e.onSelectOption,
            o = e.images,
            l = void 0 === o ? [] : o,
            u = e.limitSize,
            m = void 0 === u ? 0 : u,
            d = (0, s.useState)([]),
            p = (0, k.Z)(d, 2),
            A = p[0],
            g = p[1],
            f = (0, s.useState)(!1),
            h = (0, k.Z)(f, 2),
            v = h[0],
            E = h[1];
          (0, s.useEffect)(function() {
            var e = l.map(function(e) {
              var t = e,
                n = e.lastIndexOf("/"),
                a = e.substring(n + 1);
              return { filePath: t, fileType: xe(a), fileName: a };
            });
            g(e);
          }, []);
          return c().createElement(
            "div",
            { className: t.attachmentWrap },
            c().createElement(
              "div",
              { className: t.attachmentTitle },
              (0, M.vs)("examDetail_upload_attachment_tip", {
                size: Math.floor(m / 1024 / 1024)
              })
            ),
            c().createElement(Se, {
              label: (0, M.vs)("upload_attachment"),
              onChange: function(e) {
                var t = e.map(function(e) {
                  return e.filePath;
                });
                g(e), r && r("", void 0, t);
              },
              fileList: A,
              action: "/learn/app/clientapi/exam/new/uploadImage.do",
              limit: 3,
              validate: function(e) {
                var t = ["html", "htm", "msg", "eml"];
                if (e.length + A.length > 3) return E(!0), !1;
                for (var a = 0; a < e.length; a++) {
                  var i = e[a];
                  if (
                    /,|\uff0c|\u3002|!|\uff01|\?|\\uff1f|:|\uff1a|;|\uff1b|\u3001|<|>|\u300a|\u300b|\(|\)|\uff08|\uff09|\[|\]|\u3010|\u3011|\{|\}|\u201c|\u201d|\u2019|\u2018|\u2014\u2014|%|\$|\uffe5|\u2026\u2026/.test(
                      i.name
                    )
                  )
                    return (
                      n.g.$message(
                        (0, M.vs)("examDetail_not_allow_special_symbols")
                      ),
                      !1
                    );
                  if (i.size > m)
                    return (
                      n.g.$message(
                        (0, M.vs)("examDetail_limit_size", {
                          size: Math.floor(m / 1024 / 1024)
                        })
                      ),
                      !1
                    );
                  if (0 === i.size)
                    return (
                      n.g.$message((0, M.vs)("examDetail_not_allow_empty")), !1
                    );
                  var r = xe(i.name);
                  if (t.indexOf(r) > -1)
                    return n.g.$message((0, M.vs)("not_support_upload")), !1;
                }
                return !0;
              },
              disabled: i
            }),
            c().createElement(ue.Z, {
              showClose: !1,
              onOk: function() {
                E(!1);
              },
              visible: v,
              content: Le,
              confirmAndCancel: !1,
              okText: (0, M.vs)("i_got_it")
            })
          );
        }),
        Qe = function(e) {
          return (0, u.Z)({
            root: { width: "100%" },
            question: { fontSize: 16, color: "#333" },
            myAnswerWrap: { fontSize: 14, margin: "10px 0 30px" },
            myAnswerText: { color: "#F5212D", marginRight: 20 },
            correctAnswerText: { color: "#52C41A" }
          });
        },
        Fe = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        Ue = (0, l.Z)(Qe)(function(e) {
          var t = e.classes,
            n = e.sectionRespList,
            a = e.onSelectOption,
            r = e.answerList,
            l = void 0 === r ? [] : r,
            u = e.isViewErrorQuestions,
            m = e.isOpenRead,
            d = e.isFromResult,
            p = e.setActiveVoiceId,
            A = e.disabled,
            g = e.isOpenAnswer,
            f = e.currentSubject,
            h = e.showAnswerStatus,
            v = void 0 !== h && h,
            E = (0, s.useState)(""),
            x = (0, k.Z)(E, 2),
            w = x[0],
            b = x[1],
            S = (0, s.useState)(!1),
            C = (0, k.Z)(S, 2),
            y = C[0],
            N = C[1],
            T = f.myAnswerList,
            Z = void 0 === T ? [] : T;
          return c().createElement(
            c().Fragment,
            null,
            c().createElement(
              "div",
              { style: { marginBottom: 8 } },
              (0, M.vs)("answer_questions")
            ),
            n.map(function(e, n) {
              var r = !(e.questionType === I.ce.QUESTION_ANSWER) && u && v,
                s = [],
                f = (e.sectionRespList || []).map(function(e, t) {
                  return (
                    u &&
                      Z.length &&
                      Z[n] &&
                      (Z[n] || {}).answerList.find(function(t) {
                        return t === e.sectionId;
                      }) &&
                      (Z[n].answerList.length > 1
                        ? s.push(Fe[t])
                        : (s = [Fe[t]])),
                    (0, o.Z)((0, o.Z)({}, e), {}, { optionNo: Fe[t] })
                  );
                }),
                h = e.sectionRespList.reduce(function(e, t, n) {
                  return "Y" === t.isCorrect && v ? e.concat(Fe[n]) : e;
                }, []),
                E = (0, o.Z)(
                  (0, o.Z)({}, e),
                  {},
                  {
                    currentSubject: {
                      image: e.image || "",
                      fileUrl: e.fileUrl || "",
                      questionText: e.questionText,
                      answerTip: e.answerTip,
                      myAnswer: Z.length ? Z[n].answerList : [],
                      questionType: e.questionType
                    },
                    onSelectOption: a,
                    answerList: l[n] || [],
                    currentIndex: e.sortNo - 1,
                    isViewErrorQuestions: u,
                    sectionRespList: f,
                    isOpenRead: m,
                    setActiveVoiceId: p,
                    disabled: A,
                    showAnswerStatus: v
                  }
                );
              return c().createElement(
                c().Fragment,
                null,
                c().createElement(
                  "div",
                  { className: t.question },
                  !u &&
                    Boolean(m) &&
                    c().createElement(
                      c().Fragment,
                      null,
                      c().createElement(ee, {
                        voiceUrl: e.voiceUrl || "",
                        id: "voice_".concat(e.questionId),
                        className: "questionVoice",
                        showText: !0,
                        setActiveVoiceId: p
                      }),
                      c().createElement("div", { style: { height: 10 } })
                    ),
                  c().createElement(
                    z,
                    (0, i.Z)({}, E, {
                      isMainTopic: !1,
                      key: e.questionId,
                      changeViewAnswerTipsState: function(t) {
                        b(e.questionId || ""), N(t);
                      },
                      isOpenAnswer: g,
                      viewAnswerTips: w === e.questionId && y,
                      setActiveVoiceId: p
                    })
                  ),
                  r &&
                    c().createElement(
                      "div",
                      { className: t.myAnswerWrap },
                      d && e.questionType !== I.ce.FILL_IN_BLANK
                        ? c().createElement(
                            "span",
                            { className: t.myAnswerText },
                            (0, M.vs)("my_answers"),
                            " ",
                            s.length > 0
                              ? s.join("\u3001")
                              : (0, M.vs)("examDetail_no_answer")
                          )
                        : null,
                      c().createElement(
                        "span",
                        { className: t.correctAnswerText },
                        (0, M.vs)("correct_answer"),
                        " ",
                        h.join("\u3001")
                      )
                    )
                ),
                (function(e) {
                  var t = e.questionType,
                    n = e.questionId;
                  switch (t) {
                    case I.ce.SINGLE:
                    case I.ce.JUDGE:
                      return c().createElement(te, (0, i.Z)({}, e, { key: n }));
                    case I.ce.MULTIPLE:
                      return c().createElement(ne, (0, i.Z)({}, e, { key: n }));
                    default:
                      return c().createElement(c().Fragment, null);
                  }
                })(E)
              );
            })
          );
        }),
        Me = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        Oe = (0, l.Z)(Qe)(function(e) {
          var t = e.classes,
            n = e.sectionRespList,
            a = e.onSelectOption,
            r = e.answerList,
            l = void 0 === r ? [] : r,
            u = e.isViewErrorQuestions,
            m = e.isOpenRead,
            d = e.isFromResult,
            p = e.setActiveVoiceId,
            A = e.disabled,
            g = e.isOpenAnswer,
            f = e.currentSubject,
            h = e.showAnswerStatus,
            v = void 0 !== h && h,
            E = (0, s.useState)(""),
            x = (0, k.Z)(E, 2),
            w = x[0],
            b = x[1],
            S = (0, s.useState)(!1),
            C = (0, k.Z)(S, 2),
            y = C[0],
            N = C[1],
            T = f.myAnswerList,
            Z = void 0 === T ? [] : T;
          return c().createElement(
            c().Fragment,
            null,
            c().createElement(
              "div",
              { style: { marginBottom: 8 } },
              (0, M.vs)("answer_questions")
            ),
            n.map(function(e, n) {
              var r,
                s = !(e.questionType === I.ce.QUESTION_ANSWER) && u && v,
                f = [],
                h = (e.sectionRespList || []).map(function(e, t) {
                  return (
                    u &&
                      Z.length &&
                      Z[n] &&
                      (Z[n] || {}).answerList.find(function(t) {
                        return t === e.sectionId;
                      }) &&
                      (Z[n].answerList.length > 1
                        ? f.push(Me[t])
                        : (f = [Me[t]])),
                    (0, o.Z)((0, o.Z)({}, e), {}, { optionNo: Me[t] })
                  );
                }),
                E =
                  null === (r = e.sectionRespList) || void 0 === r
                    ? void 0
                    : r.reduce(function(e, t, n) {
                        return "Y" === t.isCorrect && v ? e.concat(Me[n]) : e;
                      }, []),
                x = (0, o.Z)(
                  (0, o.Z)({}, e),
                  {},
                  {
                    currentSubject: {
                      image: e.image || "",
                      fileUrl: e.fileUrl || "",
                      questionText: e.questionText,
                      answerTip: e.answerTip,
                      myAnswer: Z.length ? Z[n].answerList : [],
                      questionType: e.questionType
                    },
                    onSelectOption: a,
                    answerList: l[n] || [],
                    currentIndex: e.sortNo - 1,
                    isViewErrorQuestions: u,
                    sectionRespList: h,
                    isOpenRead: m,
                    setActiveVoiceId: p,
                    disabled: A,
                    showAnswerStatus: v
                  }
                );
              return c().createElement(
                c().Fragment,
                null,
                c().createElement(
                  "div",
                  { className: t.question },
                  !u &&
                    Boolean(m) &&
                    c().createElement(
                      c().Fragment,
                      null,
                      c().createElement(ee, {
                        voiceUrl: e.voiceUrl || "",
                        id: "voice_".concat(e.questionId),
                        className: "questionVoice",
                        showText: !0,
                        setActiveVoiceId: p
                      }),
                      c().createElement("div", { style: { height: 10 } })
                    ),
                  c().createElement(
                    z,
                    (0, i.Z)({}, x, {
                      isMainTopic: !1,
                      key: e.questionId,
                      changeViewAnswerTipsState: function(t) {
                        b(e.questionId || ""), N(t);
                      },
                      isOpenAnswer: g,
                      viewAnswerTips: w === e.questionId && y,
                      setActiveVoiceId: p
                    })
                  ),
                  s &&
                    c().createElement(
                      "div",
                      { className: t.myAnswerWrap },
                      d && e.questionType !== I.ce.FILL_IN_BLANK
                        ? c().createElement(
                            "span",
                            { className: t.myAnswerText },
                            (0, M.vs)("my_answers"),
                            " ",
                            f.length > 0
                              ? f.join("\u3001")
                              : (0, M.vs)("examDetail_no_answer")
                          )
                        : null,
                      c().createElement(
                        "span",
                        { className: t.correctAnswerText },
                        (0, M.vs)("correct_answer"),
                        " ",
                        E.join("\u3001")
                      )
                    )
                ),
                (function(e) {
                  var t = e.questionType,
                    n = e.questionId;
                  switch (t) {
                    case I.ce.SINGLE:
                    case I.ce.JUDGE:
                      return c().createElement(te, (0, i.Z)({}, e, { key: n }));
                    case I.ce.MULTIPLE:
                      return c().createElement(ne, (0, i.Z)({}, e, { key: n }));
                    default:
                      return c().createElement(c().Fragment, null);
                  }
                })(x)
              );
            })
          );
        }),
        Pe = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        ze = (0, l.Z)(Qe)(function(e) {
          var t = e.classes,
            n = e.sectionRespList,
            a = e.onSelectOption,
            r = e.answerList,
            l = void 0 === r ? [] : r,
            u = e.isViewErrorQuestions,
            m = e.isOpenRead,
            d = e.isFromResult,
            p = e.setActiveVoiceId,
            A = e.disabled,
            g = e.isOpenAnswer,
            f = e.currentSubject,
            h = e.showAnswerStatus,
            v = void 0 !== h && h,
            E = (0, s.useState)(""),
            x = (0, k.Z)(E, 2),
            w = x[0],
            b = x[1],
            S = (0, s.useState)(!1),
            C = (0, k.Z)(S, 2),
            y = C[0],
            N = C[1],
            T = f.myAnswerList,
            Z = void 0 === T ? [] : T,
            B = function(e) {
              var t = e.questionType,
                n = e.questionId;
              switch (t) {
                case I.ce.QUESTION_ANSWER:
                  return c().createElement(ke, (0, i.Z)({}, e, { key: n }));
                case I.ce.READ:
                  return c().createElement(
                    c().Fragment,
                    null,
                    e.newQuestionNodes.map(function(t, n) {
                      return (function(e, t) {
                        var n = (0, o.Z)(
                          (0, o.Z)({}, e),
                          {},
                          {
                            currentSubject: {
                              image: e.image || "",
                              fileUrl: e.fileUrl || "",
                              questionText: e.questionText,
                              answerTip: e.answerTip,
                              questionType: e.questionType,
                              questionId: e.questionId
                            },
                            onSelectOption: a,
                            answerList: e.answers[t]
                              ? e.answers[t].answerList
                              : [],
                            currentIndex: e.sortNo - 1,
                            isViewErrorQuestions: u,
                            sectionRespList: [],
                            isOpenRead: m,
                            setActiveVoiceId: p,
                            disabled: A
                          }
                        );
                        return c().createElement(
                          c().Fragment,
                          null,
                          c().createElement(
                            z,
                            (0, i.Z)({}, n, {
                              isMainTopic: !1,
                              key: e.questionId,
                              changeViewAnswerTipsState: function(t) {
                                b(e.questionId || ""), N(t);
                              },
                              isOpenAnswer: g,
                              viewAnswerTips: w === e.questionId && y,
                              setActiveVoiceId: p
                            })
                          ),
                          c().createElement(
                            ke,
                            (0, i.Z)({}, n, { key: e.questionId })
                          )
                        );
                      })(
                        (0, o.Z)(
                          (0, o.Z)({}, t),
                          {},
                          {
                            answers:
                              e.currentSubject.myAnswer.questionNodesAnswer ||
                              []
                          }
                        ),
                        n
                      );
                    })
                  );
                default:
                  return c().createElement(c().Fragment, null);
              }
            };
          return c().createElement(
            c().Fragment,
            null,
            c().createElement(
              "div",
              { style: { marginBottom: 8 } },
              (0, M.vs)("answer_questions")
            ),
            n.map(function(e, n) {
              var r,
                s = !(e.questionType === I.ce.QUESTION_ANSWER) && u && v,
                f = [],
                h = (e.sectionRespList || []).map(function(e, t) {
                  return (
                    u &&
                      Z.length &&
                      Z[n] &&
                      (Z[n] || {}).answerList.find(function(t) {
                        return t === e.sectionId;
                      }) &&
                      (Z[n].answerList.length > 1
                        ? f.push(Pe[t])
                        : (f = [Pe[t]])),
                    (0, o.Z)((0, o.Z)({}, e), {}, { optionNo: Pe[t] })
                  );
                }),
                E =
                  null === (r = e.sectionRespList) || void 0 === r
                    ? void 0
                    : r.reduce(function(e, t, n) {
                        return "Y" === t.isCorrect && v ? e.concat(Pe[n]) : e;
                      }, []),
                x = (0, o.Z)(
                  (0, o.Z)({}, e),
                  {},
                  {
                    currentSubject: {
                      image: e.image || "",
                      fileUrl: e.fileUrl || "",
                      questionText: e.questionText,
                      answerTip: e.answerTip,
                      myAnswer: l.length ? l[n] : [],
                      questionType: e.questionType,
                      questionId: e.questionId
                    },
                    onSelectOption: a,
                    answerList: l[n] || [],
                    currentIndex: e.sortNo - 1,
                    isViewErrorQuestions: u,
                    sectionRespList: h,
                    isOpenRead: m,
                    setActiveVoiceId: p,
                    disabled: A
                  }
                );
              return c().createElement(
                c().Fragment,
                null,
                c().createElement(
                  "div",
                  { className: t.question },
                  !u &&
                    Boolean(m) &&
                    c().createElement(
                      c().Fragment,
                      null,
                      c().createElement(ee, {
                        voiceUrl: e.voiceUrl || "",
                        id: "voice_".concat(e.questionId),
                        className: "questionVoice",
                        showText: !0,
                        setActiveVoiceId: p
                      }),
                      c().createElement("div", { style: { height: 10 } })
                    ),
                  c().createElement(
                    z,
                    (0, i.Z)({}, x, {
                      isMainTopic: !1,
                      key: e.questionId,
                      changeViewAnswerTipsState: function(t) {
                        b(e.questionId || ""), N(t);
                      },
                      isOpenAnswer: g,
                      viewAnswerTips: w === e.questionId && y,
                      setActiveVoiceId: p
                    })
                  ),
                  s &&
                    c().createElement(
                      "div",
                      { className: t.myAnswerWrap },
                      d && e.questionType !== I.ce.FILL_IN_BLANK
                        ? c().createElement(
                            "span",
                            { className: t.myAnswerText },
                            (0, M.vs)("my_answers"),
                            " ",
                            f.length > 0
                              ? f.join("\u3001")
                              : (0, M.vs)("examDetail_no_answer")
                          )
                        : null,
                      c().createElement(
                        "span",
                        { className: t.correctAnswerText },
                        (0, M.vs)("correct_answer"),
                        " ",
                        E.join("\u3001")
                      )
                    )
                ),
                B(x)
              );
            })
          );
        }),
        We = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        Ye = function(e) {},
        Ge = (0, l.Z)(w)(function(e) {
          var t = e.classes,
            n = e.currentIndex,
            a = e.currentSubject,
            s = e.answerList,
            l = e.onSelectOption,
            u = e.isViewErrorQuestions,
            m = void 0 !== u && u,
            d = e.isFromResult,
            p = e.detail,
            A = e.viewAnswerTipsState,
            g = e.changeViewAnswerTipsState,
            f = e.images,
            h = void 0 === f ? [] : f,
            v = e.disabled,
            E = void 0 !== v && v,
            x = e.setOperateVisible,
            w = void 0 === x ? Ye : x,
            b = e.currentLength,
            S = void 0 === b ? 0 : b,
            k = e.limitSize,
            C = void 0 === k ? 0 : k,
            y = void 0 !== A && A,
            N = a.sectionRespList,
            T = a.myAnswer,
            Z = void 0 === T ? [] : T,
            B = a.questionType,
            R = void 0 === B ? "" : B,
            D = a.questionId,
            L = a.voiceUrl,
            q = a.newQuestionNodes,
            Q = void 0 === q ? [] : q,
            F = p.isOpenAnswer,
            U = p.isPhotoAnswer,
            O = p.isOpenRead,
            W = p.isShowAnswer,
            Y = "C" === R || "R" === R || "SG" === R,
            G = Y ? 0 : F,
            V = [],
            J = [],
            K = (N || []).map(function(e, t) {
              return (
                m &&
                  (R === I.ce.FILL_IN_BLANK
                    ? e && e.sectionText && J.push(e.sectionText)
                    : (Z.find(function(t) {
                        return t === e.sectionId;
                      }) && V.push(We[t]),
                      "Y" === e.isCorrect && J.push(We[t]))),
                (0, o.Z)((0, o.Z)({}, e), {}, { optionNo: We[t] })
              );
            }),
            H = function(e) {
              var t,
                n = Array.from(document.getElementsByTagName("audio")),
                a = Array.from(new Set(n)),
                i = (0, r.Z)(
                  a.filter(function(e) {
                    return e.id.includes("voice_");
                  })
                );
              try {
                for (i.s(); !(t = i.n()).done; ) {
                  var o = t.value;
                  o.pause(), (o.currentTime = 0);
                }
              } catch (s) {
                i.e(s);
              } finally {
                i.f();
              }
              a.find(function(t) {
                return t.id === e;
              }).play();
            },
            X = P.Z.examStage === I.Bc.errorQuestions && 1 === W,
            j = {
              currentSubject: a,
              onSelectOption: l,
              answerList: s,
              currentIndex: n,
              sectionRespList: Y ? Q : K,
              isViewErrorQuestions: m,
              isFromResult: d,
              isOpenRead: O,
              setActiveVoiceId: H,
              disabled: E,
              showAnswerStatus: X
            },
            _ = !(R === I.ce.QUESTION_ANSWER) && m && X;
          return c().createElement(
            "div",
            { className: t.subject },
            !m &&
              Boolean(O) &&
              c().createElement(ee, {
                voiceUrl: L || "",
                id: "voice_".concat(D),
                className: "questionVoice",
                showText: !0,
                setActiveVoiceId: H
              }),
            c().createElement(
              "div",
              { className: t.question },
              c().createElement(
                z,
                (0, i.Z)({}, j, {
                  isShowAnswer: W,
                  key: D,
                  changeViewAnswerTipsState: g,
                  isOpenAnswer: G,
                  viewAnswerTips: y,
                  setActiveVoiceId: H
                })
              )
            ),
            !Y &&
              _ &&
              c().createElement(
                "div",
                { className: t.myAnswerWrap },
                d && R !== I.ce.FILL_IN_BLANK
                  ? c().createElement(
                      "span",
                      { className: t.myAnswerText },
                      (0, M.vs)("examDetail_my_answers"),
                      " ",
                      V.length > 0
                        ? V.join("\u3001")
                        : (0, M.vs)("examDetail_no_answer")
                    )
                  : null,
                X &&
                  c().createElement(
                    "span",
                    { className: t.correctAnswerText },
                    (0, M.vs)("examDetail_correct_answer"),
                    " ",
                    J.map(function(e, t) {
                      return c().createElement(
                        "span",
                        { style: { marginRight: "20px" } },
                        "".concat(t + 1, ".").concat(e)
                      );
                    })
                  )
              ),
            (function() {
              switch (R) {
                case I.ce.SINGLE:
                case I.ce.JUDGE:
                  return c().createElement(te, (0, i.Z)({}, j, { key: D }));
                case I.ce.MULTIPLE:
                  return c().createElement(ne, (0, i.Z)({}, j, { key: D }));
                case I.ce.QUESTION_ANSWER:
                  return c().createElement(
                    ke,
                    (0, i.Z)({}, j, { key: D, isPhotoAnswer: U, images: h })
                  );
                case I.ce.IMAGE:
                  return c().createElement(ye, (0, i.Z)({}, j, { key: D }));
                case I.ce.LINE:
                  return c().createElement(
                    De,
                    (0, i.Z)({}, j, {
                      key: D,
                      setOperateVisible: w,
                      currentLength: S
                    })
                  );
                case I.ce.ATTACMENT:
                  return c().createElement(
                    qe,
                    (0, i.Z)({}, j, { key: D, images: h, limitSize: C })
                  );
                case I.ce.CASE_ANALYSIS:
                  return c().createElement(
                    Ue,
                    (0, i.Z)({}, j, { key: D, images: h, isOpenAnswer: F })
                  );
                case I.ce.GROUP_SINGLE:
                  return c().createElement(
                    Oe,
                    (0, i.Z)({}, j, { key: D, images: h, isOpenAnswer: F })
                  );
                case I.ce.READ:
                  return c().createElement(
                    ze,
                    (0, i.Z)({}, j, { key: D, images: h, isOpenAnswer: F })
                  );
                default:
                  return c().createElement(c().Fragment, null);
              }
            })()
          );
        });
    },
    76138: function(e, t, n) {
      "use strict";
      var a = n(20042),
        i = n(84322),
        r = n.n(i),
        o = n(33032),
        s = n(67294),
        c = n.n(s),
        l = n(52543),
        u = n(20849),
        m = n(37200),
        d = n(90678),
        p = n(87027),
        A = n(35492),
        g = n(19040),
        f = n(90728),
        h = n(95850),
        v = n(57972),
        E = n(9549),
        x = n(69134),
        w = n(66045),
        I = n(30381),
        b = n.n(I),
        S = n(22380);
      t.Z = (0, l.Z)(d.Z)(function(e) {
        var t = e.classes,
          n = e.setExamStage,
          i = e.examResultObj,
          l = i.status,
          d = i.score,
          I = i.pointNum,
          k = i.isSubmit,
          C = e.setIsFromResult,
          y = e.detail,
          N = e.getExamBreakInfo,
          T = e.setRemainTime,
          Z = e.getExamDetail,
          B = e.changeLoading,
          R = e.cutScreenInfo,
          D = y.ishidenerrquestion,
          L = y.totalScoreStr,
          q = y.testType,
          Q = y.endTime,
          F = y.certificateId,
          U = (y.attemptNum, y.remianingNum),
          M = y.isPassed,
          O = y.showErrorType,
          P = y.minScore,
          z = y.isAgainTest,
          W = void 0 === z ? 1 : z,
          Y = y.ishasHistoryScore,
          G = y.publishScoreTime,
          V = y.markingStatus,
          J = y.isExamType,
          K = y.isSubmitExam,
          H = y.isPublishScore,
          X = y.myHighestScore,
          j = y.hasHistoryScore;
        (0, s.useEffect)(function() {
          _(), Ie();
        }, []);
        var _ = (function() {
            var e = (0, o.Z)(
              r().mark(function e() {
                return r().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return B(!0), (e.next = 3), Z(!1);
                      case 3:
                        B(!1);
                      case 4:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })(),
          $ = (0, s.useState)(!1),
          ee = (0, a.Z)($, 2),
          te = ee[0],
          ne = ee[1],
          ae = (0, s.useState)(!1),
          ie = (0, a.Z)(ae, 2),
          re = ie[0],
          oe = ie[1],
          se = (0, s.useState)(!1),
          ce = (0, a.Z)(se, 2),
          le = ce[0],
          ue = ce[1],
          me = (0, s.useState)(!1),
          de = (0, a.Z)(me, 2),
          pe = de[0],
          Ae = de[1],
          ge =
            (Number(P),
            (0, S.y)({
              isExamType: J,
              isSubmitExam: K,
              isPublishScore: H,
              publishScoreTime: G,
              ishasHistoryScore: Y,
              isSubmit: k,
              markingStatus: V,
              testType: q,
              hasHistoryScore: j
            }) || 99),
          fe = Number(X) >= Number(P) ? m.E.PASS : m.E.NO_PASS,
          he = l || fe,
          ve = !G || new Date(G) < new Date(),
          Ee = 0 !== H && ve;
        Ee = J ? 2 === V && Ee : Ee;
        var xe = (function() {
            var e = (0, o.Z)(
              r().mark(function e() {
                return r().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return n(m.Bc.transition), (e.next = 3), N(!1);
                      case 3:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })(),
          we = (function() {
            var e = (0, o.Z)(
              r().mark(function e() {
                var t, n, a, i;
                return r().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (
                          ((t =
                            window.outerWidth + 10 >= screen.availWidth &&
                            window.outerHeight + 10 >= screen.availHeight),
                          !R || 0 !== R.remainderTimes)
                        ) {
                          e.next = 4;
                          break;
                        }
                        return ue(!0), e.abrupt("return");
                      case 4:
                        if (
                          ((n = window.navigator.userAgent.toLocaleLowerCase()),
                          (a = n.indexOf("wxwork") > -1),
                          (i = Number(n.split("chrome/")[1].split(".")[0])),
                          n.includes("mac") &&
                            n.includes("chrome") &&
                            i > 110 &&
                            (t = !0),
                          a && (t = !0),
                          t || y.isFlipScreen !== m.iK.Open)
                        ) {
                          e.next = 12;
                          break;
                        }
                        return Ae(!0), e.abrupt("return");
                      case 12:
                        return ne(!0), (e.next = 15), N(!0);
                      case 15:
                        T({ recognitionStatus: null, remainSeconds: null }),
                          ne(!1);
                      case 17:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })(),
          Ie = (function() {
            var e = (0, o.Z)(
              r().mark(function e() {
                var t, n, a, i, o;
                return r().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (
                          ((t = !1),
                          (n = V === m.hp.MARK_ING),
                          (a =
                            !V ||
                            !he ||
                            !d ||
                            (d && parseFloat(d)) === parseFloat(L)),
                          q !== m.kq.MOCK)
                        ) {
                          e.next = 7;
                          break;
                        }
                        (t = !a && !n), (e.next = 12);
                        break;
                      case 7:
                        return (e.next = 9), u.Gn.getTimestamp();
                      case 9:
                        (i = e.sent)._failure && (t = !1),
                          i.body.timestamp &&
                            0 === +i.code &&
                            ((o = parseInt(i.body.timestamp, 10)),
                            (t = !(
                              a ||
                              !D ||
                              "Y" === D ||
                              (2 === O && Q > o) ||
                              (2 === O && Q === o)
                            )));
                      case 12:
                        oe(t);
                      case 13:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })(),
          be = function() {
            var e = !1;
            return (
              (e = !(q !== m.kq.FORMAL || !F || M !== m.hn.YES)), !!Ee && e
            );
          },
          Se = function(e) {
            return q !== m.kq.FORMAL || (0 !== U && U)
              ? c().createElement(
                  p.Z,
                  {
                    loading: te,
                    className: ""
                      .concat(t.button, " ")
                      .concat(e ? t.buttonLeft : ""),
                    onClick: we
                  },
                  (0, x.vs)("examDetail_test_again")
                )
              : c().createElement(
                  "div",
                  {
                    className: ""
                      .concat(t.button, " ")
                      .concat(t.examEndedButton, " ")
                      .concat(e ? t.endButtonLeft : "")
                  },
                  (0, x.vs)("examDetail_test_again")
                );
          };
        return c().createElement(
          "div",
          { className: t.resultBox },
          c().createElement(
            "h5",
            { className: t.resultTitle },
            (function() {
              var e = zn_t_intelligent_portal(
                "3d447201",
                "\u8bf7\u7b49\u5f85\u6210\u7ee9\u516c\u5e03"
              );
              return (
                [13, 23, 21].includes(ge)
                  ? he === m.E.PASS
                    ? (e = zn_t_intelligent_portal(
                        "d4f793ed",
                        "\u606d\u559c\u4f60\uff01\u8003\u8bd5\u901a\u8fc7\u5566"
                      ))
                    : he !== m.E.PASS &&
                      (e = zn_t_intelligent_portal(
                        "cc084e86",
                        "\u5f88\u9057\u61be\uff0c\u8fd9\u6b21\u6ca1\u6709\u901a\u8fc7\uff0c\u518d\u63a5\u518d\u5389\u5427"
                      ))
                  : [12, 22, 20].includes(ge) &&
                    (e = zn_t_intelligent_portal(
                      "25aad58b",
                      "\u4ea4\u5377\u6210\u529f\uff0c\u8001\u5e08\u6b63\u5728\u9605\u5377\u4e2d"
                    )),
                e
              );
            })()
          ),
          [13, 23, 21].includes(ge) &&
            c().createElement(
              "div",
              { className: t.resultMes },
              c().createElement(
                "div",
                {
                  className: ""
                    .concat(t.resultMesNum, " ")
                    .concat(
                      he === m.E.PASS ? t.resultMesNumPass : t.resultMesNumNo
                    )
                },
                d || X || 0,
                c().createElement(
                  "span",
                  { className: t.resultMesNumName },
                  (0, x.vs)("score")
                )
              ),
              c().createElement(
                "span",
                { className: t.resultMesName },
                (0, x.vs)("exam_score")
              )
            ),
          ![13, 23, 21].includes(ge) &&
            c().createElement(
              "div",
              { className: t.resultMesIng },
              (function() {
                var e = "";
                return (
                  [12, 22, 20].includes(ge)
                    ? (e = zn_t_intelligent_portal(
                        "7938ae3a",
                        "\u9605\u5377\u5b8c\u6210\u540e\uff0c\u518d\u6b21\u8fdb\u5165\u8003\u8bd5\u5373\u53ef\u67e5\u770b\u6210\u7ee9"
                      ))
                    : 32 === ge || 35 === ge || 43 === ge
                    ? (e = zn_t_intelligent_portal(
                        "02de2188",
                        "\u8bf7\u7b49\u5f85\u81f3".concat(
                          b()(G).format("YYYY-MM-DD HH:mm"),
                          "\u516c\u5e03\u8003\u8bd5\u6210\u7ee9\u540e\uff0c\u5230\u201c\u6211\u7684\u8003\u8bd5\u201d\u67e5\u9605\u8003\u8bd5\u6210\u7ee9"
                        ),
                        { var_0: b()(G).format("YYYY-MM-DD HH:mm") }
                      ))
                    : 31 === ge || 34 === ge || 42 === ge
                    ? (e = zn_t_intelligent_portal(
                        "07348afe",
                        "\u8bf7\u5728\u9605\u5377\u5b8c\u6210\u540e\uff0c\u5e76\u7b49\u5f85\u81f3".concat(
                          b()(G).format("YYYY-MM-DD HH:mm"),
                          "\u516c\u5e03\u6210\u7ee9\u540e\uff0c\u5230\u201c\u6211\u7684\u8003\u8bd5\u201d\u67e5\u9605\u8003\u8bd5\u6210\u7ee9"
                        ),
                        { var_0: b()(G).format("YYYY-MM-DD HH:mm") }
                      ))
                    : 63 === ge || 52 === ge || 55 === ge
                    ? (e = zn_t_intelligent_portal(
                        "46bd4f18",
                        "\u8bf7\u7b49\u5f85\u7ba1\u7406\u5458\u516c\u5e03\u6210\u7ee9\u540e\uff0c\u5230\u201c\u6211\u7684\u8003\u8bd5\u201d\u67e5\u9605\u8003\u8bd5\u6210\u7ee9"
                      ))
                    : (62 !== ge && 51 !== ge && 54 !== ge) ||
                      (e = zn_t_intelligent_portal(
                        "55ada86c",
                        "\u8bf7\u5728\u9605\u5377\u5b8c\u6210\u540e\uff0c\u5e76\u7b49\u5f85\u7ba1\u7406\u5458\u516c\u5e03\u6210\u7ee9\u540e\uff0c\u5230\u201c\u6211\u7684\u8003\u8bd5\u201d\u67e5\u9605\u8003\u8bd5\u6210\u7ee9"
                      )),
                  e
                );
              })()
            ),
          q === m.kq.FORMAL &&
            Boolean(M) &&
            I &&
            c().createElement(
              "div",
              { className: t.pointNum },
              zn_t_intelligent_portal(
                "084a2336",
                "\u606d\u559c\u83b7\u5f97".concat(I, "\u79ef\u5206~"),
                { var_0: I }
              )
            ),
          ![13, 23, 21].includes(ge) &&
            c().createElement("img", {
              src: f,
              alt: "",
              className: t.resultImg
            }),
          [13, 23, 21].includes(ge) &&
            he === m.E.PASS &&
            c().createElement("img", {
              src: A,
              alt: "",
              className: t.resultImg
            }),
          [13, 23, 21].includes(ge) &&
            he === m.E.NO_PASS &&
            c().createElement("img", {
              src: g,
              alt: "",
              className: t.resultImg
            }),
          (![13, 23, 21].includes(ge) ||
            ([13, 23, 21].includes(ge) &&
              (he === m.E.NO_PASS || he === m.E.MARKED))) &&
            c().createElement(
              "div",
              { className: t.buttons },
              c().createElement(
                p.Z,
                {
                  loading: !1,
                  className: "".concat(t.button, " ").concat(t.buttonLeft),
                  onClick: xe
                },
                (0, x.vs)("back")
              ),
              Se()
            ),
          [13, 23, 21].includes(ge) &&
            he === m.E.PASS &&
            c().createElement(
              "div",
              { className: t.buttons },
              W ? Se(!0) : null,
              c().createElement(
                p.Z,
                { loading: !1, className: "".concat(t.button), onClick: xe },
                (0, x.vs)("back")
              )
            ),
          c().createElement(
            "ul",
            { className: t.seeUrl },
            re &&
              c().createElement(
                "li",
                {
                  className: ""
                    .concat(t.seeUrlDetail, " ")
                    .concat(be() ? t.seeUrlLeft : ""),
                  onClick: function() {
                    C(!0), n(m.Bc.errorQuestions);
                  }
                },
                c().createElement("img", {
                  src: h,
                  alt: "",
                  className: t.seeUrlImg
                }),
                c().createElement(
                  "span",
                  null,
                  (0, x.vs)("examDetail_check_wrong")
                )
              ),
            be() &&
              c().createElement(
                "li",
                {
                  className: t.seeUrlDetail,
                  onClick: function() {
                    C(!0), n(m.Bc.checkCertificate);
                  }
                },
                c().createElement("img", {
                  src: v,
                  alt: "",
                  className: t.seeUrlImg
                }),
                c().createElement(
                  "span",
                  null,
                  (0, x.vs)("examDetail_check_certificate")
                )
              ),
            Ee &&
              c().createElement(
                "li",
                {
                  className: ""
                    .concat(t.seeUrlDetail, " ")
                    .concat(be() || re ? t.mgl50 : ""),
                  onClick: function() {
                    window.location.href = "#/home/examScoreRank/".concat(
                      e.examId
                    );
                  }
                },
                c().createElement("img", {
                  src: E,
                  alt: "",
                  className: t.seeUrlImg
                }),
                c().createElement(
                  "span",
                  null,
                  zn_t_intelligent_portal(
                    "8f0cdc6d",
                    "\u67e5\u770b\u6210\u7ee9\u6392\u884c\u699c"
                  )
                )
              )
          ),
          c().createElement(
            w.Z,
            {
              visible: le,
              onOk: function() {
                return ue(!1);
              },
              okText: (0, x.vs)("i_got_it")
            },
            c().createElement(
              "div",
              null,
              (0, x.vs)("administrator_to_unblock")
            )
          ),
          c().createElement(
            w.Z,
            {
              visible: pe,
              onOk: function() {
                return Ae(!1);
              },
              okText: (0, x.vs)("i_got_it")
            },
            c().createElement(
              "div",
              { className: t.warningText },
              (0, x.vs)("warning")
            ),
            c().createElement("div", null, (0, x.vs)("keep_screen_max"))
          )
        );
      });
    },
    67001: function(e, t, n) {
      "use strict";
      n.d(t, {
        Z: function() {
          return v;
        }
      });
      var a = n(84322),
        i = n.n(a),
        r = n(33032),
        o = n(20042),
        s = n(67294),
        c = n.n(s),
        l = n(52543),
        u = n(30381),
        m = n.n(u),
        d = n(87623),
        p = n(37200),
        A = n(20849),
        g = n(40053),
        f = n(67246),
        h = n(69134),
        v = (0, l.Z)(function(e) {
          return (0,
          d.Z)({ historyBox: { minHeight: 520, position: "relative", padding: "40px 0" }, historyIcons: { position: "absolute", right: 60, top: 0 }, historyIcon: { width: 78, height: 52 }, historyTitle: { maxWidth: 600, fontSize: 24, color: "#333333", textAlign: "center", margin: "0 auto 20px" }, historyMes: { height: 20, lineHeight: "20px", fontSize: 14, display: "flex", justifyContent: "center", alignItems: "center", margin: "0 0 30px" }, historyMesLeft: { display: "inline-block", color: "#999999" }, historyMesRight: { display: "inline-block", color: "#151515", marginLeft: 0, fontWeight: "bold" }, historyMesTwo: { marginLeft: 50 }, historyMesBox: { display: "flex" }, historyTable: { width: 1060, margin: "0 auto", fontSize: 14, color: "#333333" }, historyThead: { background: "#F5F5F5", height: 50, display: "flex", alignItems: "center", fontWeight: "bold" }, historyList: { height: 270, overflow: "auto" }, historyTbody: { height: 59, borderBottom: "1px solid #F5F5F5", display: "flex", alignItems: "center" }, tdOne: { width: "33%", textAlign: "center" }, tdTwo: { width: "34%", textAlign: "center" }, tdThree: { width: "33%", textAlign: "center" }, ing: { color: "#FAAD15" }, pass: { color: "#52C41A" }, noPass: { color: "#FA534A" }, goback: { fontSize: "14px", cursor: "pointer", position: "absolute", top: "26px", paddingLeft: "50px", width: "50px" }, noMakeExam: { color: "#FA534A" }, isMakeExam: { color: "#999999" } });
        })(function(e) {
          var t = e.classes,
            n = e.examId,
            a = e.detail,
            l = a.testName,
            u = a.totalScoreStr,
            d = a.minScoreStr,
            v = e.setExamStage,
            E = e.getExamBreakInfo,
            x = (0, s.useState)([]),
            w = (0, o.Z)(x, 2),
            I = w[0],
            b = w[1];
          (0, s.useEffect)(function() {
            S();
          }, []);
          var S = (function() {
            var e = (0, r.Z)(
              i().mark(function e() {
                var t;
                return i().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (e.next = 2), A.Oe.queryNewHistoryScore(n);
                      case 2:
                        if (!(t = e.sent)._failure) {
                          e.next = 5;
                          break;
                        }
                        return e.abrupt("return");
                      case 5:
                        t.body && 0 === t.code && b(t.body);
                      case 6:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })();
          return c().createElement(
            "div",
            { className: t.historyBox },
            c().createElement(
              "div",
              {
                className: t.goback,
                onClick: function() {
                  v(p.Bc.info), E();
                }
              },
              "< ",
              (0, h.vs)("back")
            ),
            I.length > 0 &&
              c().createElement(
                c().Fragment,
                null,
                c().createElement(
                  "div",
                  { className: t.historyIcons },
                  I[0].examType === p.kq.FORMAL
                    ? c().createElement("img", {
                        src: g,
                        alt: "",
                        className: t.historyIcon
                      })
                    : c().createElement("img", {
                        src: f,
                        alt: "",
                        className: t.historyIcon
                      })
                ),
                c().createElement("h5", { className: t.historyTitle }, l),
                c().createElement(
                  "div",
                  { className: t.historyMes },
                  c().createElement(
                    "dl",
                    { className: t.historyMesBox },
                    c().createElement(
                      "dt",
                      { className: t.historyMesLeft },
                      (0, h.vs)("examDetail_total")
                    ),
                    c().createElement(
                      "dd",
                      { className: t.historyMesRight },
                      (0, h.vs)("totalScoreStr", { totalScoreStr: u })
                    )
                  ),
                  c().createElement(
                    "dl",
                    {
                      className: ""
                        .concat(t.historyMesBox, " ")
                        .concat(t.historyMesTwo)
                    },
                    c().createElement(
                      "dt",
                      { className: t.historyMesLeft },
                      (0, h.vs)("examDetail_pass_score")
                    ),
                    c().createElement(
                      "dd",
                      { className: t.historyMesRight },
                      (0, h.vs)("totalScoreStr", { totalScoreStr: d })
                    )
                  )
                )
              ),
            c().createElement(
              "div",
              { className: t.historyTable },
              c().createElement(
                "ul",
                { className: t.historyThead },
                c().createElement(
                  "li",
                  { className: t.tdOne },
                  (0, h.vs)("examDetail_exam_time")
                ),
                c().createElement(
                  "li",
                  { className: t.tdTwo },
                  (0, h.vs)("examDetail_score")
                ),
                c().createElement(
                  "li",
                  { className: t.tdThree },
                  (0, h.vs)("examDetail_pass_or_not")
                ),
                c().createElement(
                  "li",
                  { className: t.tdThree },
                  zn_t_intelligent_portal(
                    "d4cf050c",
                    "\u662f\u5426\u8865\u8003"
                  )
                )
              ),
              c().createElement(
                "div",
                { className: t.historyList },
                I.map(function(e) {
                  return c().createElement(
                    "ul",
                    { className: t.historyTbody, key: e.attemptId },
                    c().createElement(
                      "li",
                      { className: t.tdOne },
                      m()(Number(e.completeDate)).format("YYYY-MM-DD HH:mm")
                    ),
                    c().createElement(
                      "li",
                      { className: t.tdTwo },
                      e.markingStatus === p.hp.MARK_ING ||
                        null === e.score ||
                        void 0 === e.score
                        ? (0, h.vs)("examDetail_not_yet")
                        : e.score
                    ),
                    c().createElement(
                      "li",
                      { className: t.tdThree },
                      e.markingStatus === p.hp.MARK_ING &&
                        c().createElement(
                          "span",
                          { className: t.ing },
                          (0, h.vs)("examDetail_in_marking")
                        ),
                      e.markingStatus === p.hp.MARK_END &&
                        e.isPass === p.E.PASS &&
                        c().createElement(
                          "span",
                          { className: t.pass },
                          (0, h.vs)("examDetail_passed")
                        ),
                      e.markingStatus === p.hp.MARK_END &&
                        e.isPass === p.E.NO_PASS &&
                        c().createElement(
                          "span",
                          { className: t.noPass },
                          (0, h.vs)("examDetail_failed")
                        )
                    ),
                    c().createElement(
                      "li",
                      { className: e.isMakeExam ? t.isMakeExam : t.noMakeExam },
                      1 === e.isMakeExam
                        ? c().createElement(
                            "span",
                            null,
                            zn_t_intelligent_portal("631b9e9e", "\u8865\u8003")
                          )
                        : c().createElement("span", null, "-")
                    )
                  );
                })
              )
            )
          );
        });
    },
    91914: function(e, t, n) {
      "use strict";
      var a = n(87623);
      t.Z = function(e) {
        return (0, a.Z)({
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
          topLeft: { display: "flex", alignItems: "flex-end" },
          subjectNum: { display: "flex", alignItems: "baseline", height: 35 },
          currentSubject: {
            fontSize: 34,
            color: e.palette.primary.main,
            fontWeight: "bold",
            fontStyle: "italic",
            marginRight: 5
          },
          totalSubject: { fontSize: 16, color: "#666" },
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
          timeLimitDisabled: { marginLeft: 28, fontSize: 14, color: "#666666" },
          timeLimitIcon: {
            display: "block",
            width: 16,
            height: 16,
            marginRight: 4
          },
          timeLimitDialogBox: { padding: "0 0 15px" },
          timeLimitText: {
            fontSize: 22,
            color: "#333333",
            fontWeight: "bold",
            marginBottom: 10
          },
          timeLimitLabel: { fontSize: 16, color: "#333333" },
          topRight: { display: "flex" },
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
            backgroundColor: e.palette.primary.main,
            borderRadius: 2,
            cursor: "pointer"
          },
          submitIcon: { width: 16, height: 16 },
          submitExam: { marginLeft: 4, color: "#fff", fontSize: 14 },
          manipulate: {
            display: "flex",
            justifyContent: "center",
            marginTop: 50,
            marginBottom: 90
          },
          manipulateBtn: {
            width: 230,
            backgroundColor: "#fff",
            color: e.palette.primary.main,
            border: "1px solid ".concat(e.palette.primary.main),
            fontSize: 18,
            "&:hover": { backgroundColor: "#fff" },
            "& .MuiCircularProgress-indeterminate": {
              color: e.palette.primary.main
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
          next: { marginLeft: 100 },
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
          warningText: { marginBottom: "10px", fontWeight: "bold" },
          searchBtn: {
            color: "#00000040",
            background: "#f5f5f5",
            borderColor: "#d9d9d9",
            cursor: "no-drop"
          },
          dialogFooter: { display: "flex", justifyContent: "center" }
        });
      };
    },
    64229: function(e, t, n) {
      "use strict";
      var a = n(87623);
      t.Z = function(e) {
        return (0, a.Z)({
          loading: { height: 640 },
          testCategory: {
            position: "absolute",
            right: 64,
            width: 70,
            height: 48
          },
          contentWrapper: { display: "flex", justifyContent: "center" },
          content: { width: 600, marginTop: 30, paddingBottom: 68 },
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
          testContent: { marginTop: 30, width: "100%" },
          topData: { display: "flex", width: "100%", height: 64 },
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
          data: { display: "flex", alignItems: "baseline" },
          dataNumber: { fontSize: 20, color: "#333", fontWeight: "bold" },
          dataUnit: {
            marginLeft: 2,
            fontSize: 14,
            color: "#333",
            fontWeight: "bold"
          },
          dataText: { marginTop: 8, fontSize: 14, color: "#999" },
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
          testInfo: { width: 400, height: 115 },
          invigilateTestInfo: { width: 491, height: 140 },
          infoItem: { display: "flex", alignItems: "baseline" },
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
          info: { flex: 1, marginLeft: 5, fontSize: 14, color: "#333" },
          autoInfo: {
            flex: 1,
            marginLeft: 5,
            fontSize: 14,
            color: "#333",
            marginTop: 14
          },
          remainTimesItem: { marginTop: 16 },
          attentionItem: {
            marginTop: 12,
            lineHeight: "24px",
            wordWrap: "break-word",
            wordBreak: "normal",
            overflowWrap: "break-word"
          },
          invigilateItem: { marginTop: 14 },
          openTime: {},
          remainTimes: { color: "#F5212D" },
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
          checkIcon: { width: 21, height: 21 },
          checkText: { marginLeft: 4, fontSize: 14, color: "#4E8FFF" },
          btnDisabled: {
            backgroundColor: e.palette.action.disabled,
            cursor: "none",
            pointerEvents: "none"
          },
          ManipulateDialogContent: {
            fontSize: "22px",
            color: "#333333",
            textAlign: "center",
            fontWeight: 600
          },
          warningText: { marginBottom: "10px", fontWeight: "bold" }
        });
      };
    },
    5269: function(e, t, n) {
      "use strict";
      var a = n(87623);
      t.Z = function(e) {
        return (0, a.Z)({
          root: { position: "relative", width: 1200, marginBottom: 70 },
          invigilateRoot: { minHeight: 640 },
          loading: { position: "absolute", width: "100%", height: 640 },
          hide: { display: "none" },
          tipsText: { color: "red" }
        });
      };
    },
    22380: function(e, t, n) {
      "use strict";
      n.d(t, {
        k: function() {
          return o;
        },
        y: function() {
          return s;
        }
      });
      var a = n(37200),
        i = n(30381),
        r = n.n(i),
        o = function(e) {
          var t = e.autoSubmitDate,
            n = e.testTime,
            a = new Date().getTime() + 60 * n * 1e3,
            i = new Date(t).getTime();
          return a < i
            ? r()(a).format("lll")
            : a > i
            ? r()(i).format("lll")
            : r()(t).format("lll");
        },
        s = function(e) {
          var t = e.isExamType,
            n = e.isPublishScore,
            i = e.publishScoreTime,
            r = e.ishasHistoryScore,
            o = e.isSubmitExam,
            s = e.isSubmit,
            c = void 0 !== s && s,
            l = e.markingStatus,
            u = e.testType,
            m = e.hasHistoryScore;
          if (u === a.kq.MOCK)
            return c ? (t ? 22 : 23) : m ? (t && 2 !== l ? 20 : 21) : 11;
          if (1 === n) {
            if (i && new Date(i).getTime() > new Date().getTime()) {
              if (r) {
                if (c) return t ? 42 : 43;
                if (o) return 41;
              }
              return c ? (t ? 31 : 32) : o ? (t ? 34 : 35) : 33;
            }
            if (r) {
              if (c) return t ? 22 : 23;
              if (o) return t && 2 !== l ? 20 : 21;
            }
            if (c) return t ? 12 : 13;
            if (!o) return 11;
          }
          if (r) {
            if (c) return t ? 62 : 63;
            if (o) return 61;
          }
          return c ? (t ? 51 : 52) : o ? (t ? 54 : 55) : 53;
        };
    },
    56673: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAA8lJREFUSA3FlVlIlGEUhp0Zx0HtrmV0WmmjvS4myKhosYIoos2LCqKC0dEpo40WiAlaiCItzVGJumghiApaFDLLCMKm7MYIiiIo0CiiHUlnxp737/8npZnwJjpw5vu+95zznnO+5Z+UlH8stp7y+3y+QTab7Sr+dVVVVdt6GmfviWNRUdFg/Bo6Ozsnom96EmP5pFqTZGNBQcGQjo6OBuxKsqe6uvp4Mt9E+F+3yO/3D41Go3cIHITuhvyARZKfn7+A+Sw6msTWfWJscjgcV0Kh0DPLR2PSBOz5MALvEDiQcQf7fkgBgUDAQ0cV4Iu1RqKoQxP8foAHc3NzD+fl5QlPSXgGVDcC57six2e7Rc5ZjGxvb39okl/FZ7LL5cp0Op19mC/DtxU9WF9ff5DRkD86EAkVals8BG2B/Kg86WgUw2002263b66srCwR3lUKCwt7RSKRRuJGs13TKyoq7nfrQCTmgYp8k0VOR2MgakBFviERuRJB+A37Ojq0c3Z+YfEEZM9iXYdmQ74R8mNyoKOxDOqoH1oIeTljUsEexvieJF45xROQ8SzrAVSwF/IyGelovLYL577gfm5RSLgEzEZnB9BLv5DfvxTYgnqEGAlwmkvAHMCmrKysfTKY26I974P6qKxKuMQkDzHuZJltgOYPRTmZ6ryaBVkdrDYWdnsgGAxGUDvB58B6k3Q9lZ+UXWKSVzPNRx9nZGQsFG4JnQbwcaH3hBkvmcV0iN7xSBoFtrS0jGSYhJ5nu04LkygxL1vJ1uL/CLJ5JSUlHw0jPzzMKbFYbD+2N2lpacZVtTpQm68tR65YpuY4frAwkZP4FMWsBXuYnp4+l4Li5FySqZzjTWxOEq8rKyv7olijA4jaCEwXIHG73c2tra1vwdZzFmHGp6x3Y1qKPkDnl5aWfmY0hH2fBnktCxdceSS+ZZriZ/ASw3A9FBmoth3SNWAxxjNATYwiv8XLnceZxMkpYAZ+tdjTGFdwGa6IwxKjAxY1OHh5hWuYn5ARkpu8gXFgK1i6CW6kssuMnbJLOI+Z7Pl1pk7w5ZzXNcPQ5cf4VJgfsBfgUb4rE8rLy1918Uk4hXw25NcgdlDcMgq6kcjR+AqGw+GvXq83guMCgqbl5OTUgX1KFCAM8lX4XhA5B7qEymuS+Xb72LGf1i35TsCu1NTUU/q+WMH6ELJlRyBfBPk3s3LdnKTSLYG8SLKVwCDTTEj0fX9ukvUH0x+PpJnKV3KgT34tk//+kUCuxcXF7ra2Nh/E+tcagep2vSOZHuJFj8dziZsWY/7/5SdmV84BgH91+QAAAABJRU5ErkJggg==";
    },
    98544: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAvlJREFUaAXtWM9rE0EUnpfMNtAcKlhEr170Iqj/gKjooWmlkuZQhdKLRUEU6tWr1yqC1HpTDyKJWBraaz0oevEHvXnVg6KmWNA07E72+XbTiZvdTU2ms2zB2cPOzsx7b77vezOzO8uYuYwC/7cCkBR9MTE6hYhzCPjJAj4J5aWPSYyVCAFRHL2EzF1Axvz4dPvCM/xkEiQyulWxS4WZIHgvPhE5IFyxiqVzh3SPpzUDHnhw8b5UPgw2iUxoI/Av8JKMbhJaplCv4D0S/nTC5gtd02nHBOLAk8pzwKAmVafyKS3nNVmn3Wm/8EhMjh2WbarljgiI0sh0eM574K1nKzcIMIndujLAflhW9nSEhOOu4oXCQWmnUioTIBUBXbgbXLAAcNsH7yHB1hYqQcGTaiwJx8ab0kalVCZAYBEZfpOD+uAry7OyHsyAbPNJDOZOBTNBGfsq+1VKruIkfSyeGxFN+wog+8Aryw9lu1+GMiD74NHzGk6PnxC/nFkGWOf5fXdkn0pJAiRzOROF7zTNhr3otAbu8crK1SRGUp5CSYBRiWkIqKim08dkQKeaKrFMBlRU0+ljMqBTTZVYJgMqqun0MRnQqaZKrMjnNJZKA06mcdwaYmvwoFpXCarbB2fGBp1a84iVyb+HctkOxo9MIYG/q0w0XzvrzZdBw76fu5wH+o5DDs66+4qKN8KtL4X9IwToKHjGN0J2DKfO7w079FwPnIkZnT579gsZ0sF/mCEebTXj2VA3ixAInnHZJo/0hwN0rSN72+4DeNd+7veB/8XQgW0rTmQN9Bu/mz3PD1wUm/ZlQPicLVcfM1A8/Inmto6JEfDOvkTulk9QFbznzLPIbOGHibupT5G4aCm0GQIpiN4xpMlAhxwpVLbdhRx3s0gvkkoKuNpDOg272K7EPEQI0I63QT89h1q27rxjs/kYv1SaPGzhgSNrgD5hFsNGu6Uehy2SASu355rT+In0+hunf+RbmUibAmzQZ8QiYbueNhIzvlFgtynwBw1N/qVo3EDmAAAAAElFTkSuQmCC";
    },
    57972: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAA+JJREFUWAntWEtIVFEY/s84oy2M0YiioHwRQQoWRNFj004oHF2oSQQVkpmlRURERBLVoo3OqJnRIoqMUmsMWgRhtCmKEiMogx4URQZWlJnOOHP/vnN15HYd70NH2twDx3PO//zmf9xzr0TOcCLgRMCJgBOBmURAmCkX+nkPhNLM5KbDh92hBXPo/IVKMWqm7zYSKPHz0pBCLWwkNAOetNsfpkdYnpqZMQQ6qpBLGhCCvgmmJjNjdvgAuQMzw8VjPsx0DYFqlAeCB0Wd5jzjra+BNxFThlVDasSsCv9POasRVTGWt/L8oWF6iMNcI9BokgddB8RWIxm7PFtAIwqlAEQmM3kMHQnKNORPg2kr9e1V4nPyYvJCKd1orsqnjdPAYqhiK6LSUnupGMYi55QjOM4pbOTVIkIHSFAuSO+xXumqFbckGx0fkisypK5ybzRsAd3dyp6vI3QCXmI1+hK12BrPQVE9lysRugxAbokKYyXW4sJ6Pnv7oDiCGqoAwsxbNeJ5PH09zRbQb2HKYYWOaYwMYD8JaMlFnhcepBbw3AjZcU8SdUSitAa1fQ7nw3g03WyvFY/B/6ixZbi1BbRjH70uCtA2pCt13OrbeNZDf2gd6F7I3UHET43L9CHK2QrTCXZRAWgSqOVhC6gQuJ+I2sys47bJVsaEXmllWdArtQwUytLSrextdb0Vg1IGv0bFKVz/Xo/4mao/XMljVWvVIORmBSgi+kEFzGoJTMBRBK0fP1iuzZiyrdTHlMxWr5fuff9J/Wiedejy62igDuisRc1WYR91J9E1Mxt6/qxE9NJOMQJHZQD1C2spEn0D8xCAy5RXd+4XfXogZudZASqdegR9QU12aQGgNvtA+1V3n21nMuFAmVngq+AM3mVfInzbtUAR0Tx0WVtPL/UW+zlPyzPbJxyoL0DN6PmjamcLakLnb0hJpkWYy+BsJ+r0BUDlRpm6fQFeYQYwxredgphivBUP9DpFQcMQDQBoAe71Zzq5N7iGr34dpkZEtxK3XHdJM69srxb9OrlJx4RFtKSRs5Dqo/AQcSXR5uBkkKpz+SEXrKUq/JAgWmtheJROTkIVh5AwoKEIrkaiZACoD9aIJ3F8TZDkDedKoUrI/gZxV1GAcyaYU2yspj6lOMD5ehsuNw127hXvJB1OfUinvJbS8dJxWi+rPyt4dcL4DJ3lmFuw96uUKf5YAgpDmdEo9eptgEb4pM7IraFPPX7ySj6wVqhPS72wwdmlULoBW2UZAk1Lo/4fP+kuJOP/A4JpMJRKP+qEUAobuAxyS8wc6vnIBLNHvbn0LOfsRMCJgBMBJwIJjMBfgOIn07Zo/asAAAAASUVORK5CYII=";
    },
    30162: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAntJREFUWAntVuFy0zAMln3HC/AWTZ8g6SuRZLCtHYNtXTmga+G2JPBITZ8g6ctwFlKG2lxwU7vjBz/qu5wiWdL3xZFlA5zG/7oCdTaa1Xk0+Vf86ix6qIsw7ebTXQPrDI5gbhBxXhfR2ObjY2NwBByjgac6H521Y60ElIJf4oQGifnxJGgV5wwu+RTscrONdPvY5KNbg+ZeZpXS4yBZLUV3kQ044vY3aqXjQbL60Y7dS4CdNkV0ZwxOJcCHRJWNvgKYK4nVoJJBWhaii7T+ApkcxCWtgNquAqJZVFl4IfP7ZBcclEpt4BzfS4Adhmk5bZMg07KPRFWEX9pfzuDDpMw5l20cJMBBDQkFs1aC5SaPzlt680q2z2DgvdiVhrM+cPbrrQFJJLLKw3tAuBVdK3UxSMrvrDO4QbyWOQYP4nUm+j7pRYCTSI+QhFRc56jhNW3XD2KjYn1LO+ZJ9D7pTYCT0fb6RE3qoy2xDzjHH0WAA20klNbvgnj1yPOuw6kIXZNRfaCz7x/Howg0dWD5BdQnHru9/hAhbwK8E/igksS8E+ihvf88GhKWU0/mu9KrBvq2YdOAOj3AZRs6r0CVRdN2D6AvuZQewF81jNfX1Fep/z8PPnqrPEpE3yedCDTggHetJJfDdP2tpTevDQnQ860dMdtkUbzVLS8HCfCJCC1wPhFt4JJ7mK6oFe9IGMC8j0RvDbzkTuByF2DSewn8Ba7VJIjLhXypi3QhYSVAl8cbKqKZgCilroKkfBDdR8p9UGII8E2Qrn+Kbq8Bo1+Jw0vAOUeQlhO6Y+6ucmqXWzCskrvdpgi3Vyqrk4exzsOFb5f0SH9yPa3A8SvwG55eHB20VbhUAAAAAElFTkSuQmCC";
    },
    80117: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAACj9JREFUeAHtnfurFVUUx71ZWmaZmahhikKJComkZpL91MsC/akfpEgkqL8pKOJG0A9B9IJS+k3RsqIMsixKNEuttCyttId9vufuPczM2WufPXNm5twbd8Fyz+znWp+zZ7/m3OPYjBHKlStXrqf5xegt6AIXziWchc52IcGMy+glF14g/Ak968LTY2NjF7keiYx12SrArqG9legKp4saav8M9Rxz+g1A/2qo3oHVtA4QaGpjOboOXYOqZ7Up6qlH0MPocWBeabOx1gAC7moMX49uQee36USk7p9JO4B+DMi/I/lqJzUO0D2mG7BI4G6obVmzBX+jOoH8sOnHu1GAwFuFkdvQm9DJKL9g1NtAPNqUcY0ABJyACZwAVpVzFDiJ+llV93+iftblMpuVr+X6ZtTP2kvdPUElEUCBFNChZGiAwNPEsB2VcynyD5nkwJfoMZw4n1LIykP780hbgerDuwOdiaaIPqQ3aF8TTm2pDRDDNUk8iG5KbP0U+T5CP8PoPxLLVMqGTddRYC16F7oksfAh8u3FplqTTC2AGDqHRneityUYeYI8+zDwq4S8jWXBxtupbCu6LKHSb8nzMjb+npC3kKUyQAzTI/MEurBQU/+NxjKNM52CK5vhQGp81tgZkx9JfAl7Kw0plQBijAbvJ9EbI5ZojNuH7seYWo9FpO5aSdit4eZeVD0yNkb+SvqL2K2tYpIkA3Q97ylqjcHTwvUVDPg+qfWOM+HDrTT5GBpb2Avi86k9MQkgDWvM243GHtvPSX+dhjW7TVrBF60WdqCrI0bqcX4BXwaOiQMB0qC6/y40NmG8R/oeGmx130kbjQg+ye+H0M2RCjWxjONTdBi6KlKBT9JSJQbvXRp5Z6rAk1OyVTZz+a7uDZHP8j0qUYB8Ulokx9Z5grc/2sIkTnS2xyBucgxML0yAFNT2TDsMS96byvC8U84HDUGWbHcsgukmQHJr7WRtzzRh7AnWODUj5Yt8CokYiEVQggAhrn2lNCRaqmi2nRITRsiBcpzz5XXi5VtIVjkmfWl9AMmoY3eL+D+kaZ03qZcqfV4mRDifXiGrfAzJNsemkNYHkNSNqMa/kGhPOykXySFjq8Y537SLComY6KC4IFrjZQJh3d+TRRQvtLetNONSn/af96Fa+WtdpQ/gEmEnQvsraOhudBb6BaoT6X8JYyIf70RDe+ct1PkBdWRrwwJACq1HrWN4HQxkBckXFRpSPU+jfiJazrXGknHquRAt3EAi7ehJejRX1Uqu1Yv25uL6LuUjZd8m4fG+xAk2YvSBT8seYQppda73GCE5QcVVT1V0Jufh+Tq1FdxFW3r325pQfxmeb2szaeVO49Oy0Pl6IosoXqgXZju4DCB51EP0qIXEGhdCeX1cGZ6PbxViBJ7al796nFPE8lmMxKoneYDrfGQpPFWj96mKWI9tBeIAeLLpJL4MPCBQRuezTtFDkrHqAaRhLV20bQuJjuErCwZ8TaGDkYKNQkyAdxFbXovYE0qyfF/jmPW6tAquRGcHatCa6LNAfFIUELXCfz+SuRGIifDGsSf5oNTZLN9D60KxErMMoKb7kByl0T9CCalxlNeM1hrECvB+SLXZ53O+6+1hSHrM/BhoAbQKhyo049qC2Ca8nDNHc9f5ywmAGHE9sYvyKbnrY7nroS6bhtgRPPlsMVgkduqBiw0y53D6vJFWK7opiB3C02wsBtqFhWSxAOpNW0hOhiKHjRsWYpfwcr5aLG6JAaw6Y+Xai1/WhTgieHLmrOFRD6C+WhsSq1Aob+W4qhBHCE++WZ1pgfaF1r7Ueu4rw7IKCCJglHy3kcevEz8h/QEjj6IvouPUV3mpEqkzn2SxmKtH2NobdnJomtgTRwlPIC0WswQwtANRoc7O7RIgyp6QtN3zfJsWi9mxHnjZl+4irAGxK3hy32LR64Fd8ElqowJEnaiMk7+tMS/JXmVSDzTpJtfSbEZrxsu3ojEp6VgqX2iIa2ueuCyA5vM9RIO1iiYsVXy9el+xi/zWCsLnayo054lYD7ROlJsyqlBPBXi+nF/idAHRYtHrgdYLntBbKW98o2ENeL79riBaLC6oB1o7DmuH4o1vJEyAp9n200hjXUC0zgt+EkBr0LYKRXyplpQIT7Ptq9Tc2qFsgtVWZzobA7g0oeLaWSrA6y1VgNjqyfYARywWvR542ih8M07OM9KGiq4Kzzc2CoiOgTUGnr4KozTGnPFGlkLrqL+ULf22LjzfwgggWgzOiJ0eYYl1bH3HRHIz/w4Lz1vRMcRVvt1S2GM2CKC+y3JdqWCt26bg+ca7gOh8tzpRAeA3GBbakcwkfq03um7YNDxvRwcQ5bsYlEWsxGzivTCG/MX1EUUERF8Sqi1twfMGtQzR8v2IY5a9WJc9h71RpXAJEG4vxSXdUm4DGR+NZNYENo4xQ52qVICoV7hJ4nxeYmTOWPkxUPmOo9Z3hLcaFZnRGHAriY+YGRo+hk+EuD1iTznJ8lmMxKonGUAM0MuJAy6+HCyr0Qs1fmT1lypspOeV6tQ73EGLbU2K1sFAVp3zdVkWUbw44Fj1YssOfkzsb8X82Z2+ZD3wy4lZ7hkz9IGEpBV4vqEBEGWTZVevCufjNl9fKRQbMcqkAJDG9RVeqxdqNX5vVnLwhQ4Ayt9sahWeNykCUX8tH1pt+KIK5aO181DvE6NMCgBd7IeEv2Q5ihdb+YQ0tg0UGtLE8BL6HarT46Pocy6ey3aFdvQ4v4XqsEQ95xD6JmqK880a+8REbAoyVrhzN1Sk1ffOUBpxGkSfxUDrVZ9RbHJH47PGxmfQ+Yal+kkAdYKChHqgBmNl7MvsSqqBHTQYhF+ofYrcOF92YK4FT9+TDPIIAnR+6xGwetlq0h5y+f4PgXyRTyERA7EIigkQ4nrm3wiWmojUnwxUmVQiVY0uyfmwOWKBflvGmhPMdVqvPgpqe6fB15L7pzJEZ/v9lnPEH3IMzCxmD8yV2Mv1t7n78qUgPoxOmTFRtspmHInBk8/yPSpJTtPYHGrZjS6M1PY5adM/OmEBAuI80p5Cb7TyEK8lzvTPnliAgKg3dU+iMYjafexDp394Bwh94nriEyTEHmeVO4dO//STSJTFjYk7ib+tnBa4P0Hc9I+PlcEAUSczD6KbymnG/Sni9bdn0z9/lwcEyDXc66By4DmbK6cxUtuiL9Emf4BRL39WoTPRFNEOY3Q/wJi3EIg3ca8zNDlQVTRWnkR1aqLv6ehezl1CL6OSWehsVB+SjpoWoJrQlrp7gkqiD3By/ARo3mxACqBACuhkFG3JBE4AG5GkhXSVloB4Dfk3ovegN1Qp22JenQceRPWDEXoD2Zg0DtBbBkhNMuvRLah1TOSztxVqYa8T9qnzQ9xlEoDUh7QcXYdqwtFY1qZo7NQhyGH0OD0u+g5kWENa64Ehw9zjvZK0FU4XhfLViDtDmWNO/1//GUEMBkD1onsxqhlVqtl1LupnXYUSzcbqWQovoJqtNWtLR/rfYfwHzBu1XySGEloAAAAASUVORK5CYII=";
    },
    916: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAA0lJREFUSA2tlVtI03EUx91FVxCVPhR0gXoKbNhL1FMEBYJh0aaSmyCLHopgWhCCb/pWQT5EdKF6kAqM4YxuFvQWPdSDD8o0MhC6rCKKNsi5oVufX+z8O5t/tmn+4c8533P7/s/5Xf5VVf/xtLW11fT19bmXUsK5lGAd29HRsXZhYWF0fHz8di6Xc2hfKX1JXyeF2tvbN6VSqacQ7TK21tbWX4hu8ZeSy+owk8lsp+gOKZzNZrv8fn+P4FKy4lEUF2lpaTkMURS7TCntdru9kUjkfXGsxhV3SAcnQqHQKkkeHh5+5HQ6w4KRnvn5+csK26oVEdLNAOt1K5FI3GNXWjmQXqfqS1W5ifVsVniRaiUv8uQNPp+vn9GdzUP/xMTEaR3rcDjOgHNiY+eeFN1OliVkbHdJ/CHJdNrP+asTHI1Gx9CfCeYDGhn9esHFsiwhY5umyDlJhLCOjkOCjcRvNs/fB39NMpk8KrhYLiLk61ezZqd0IKSD4CmxQXhMdCNdLtdjhDVW9APGbvcUEEK2hp02SsFr7EqfJNBBjveBwrvD4bBHMEfhK37rONDlVvEVS4swGAzWsuAvCNifD+rUwazla8EUdMbjcXP4rQfbNwGQbxG9WFqEc3Nz90naqwJ2Kt2oPzXmA2o1huS7wpuVXqBahCR08X4WL+QfRM/LdRoz9qTGWid3VmOtW4RsjLcs/j5IZ0wAMqIDGbfuOEeHX7QfEmvE5H7SPq1bhMbI4s8YUtTBhoaGmzoQ3S+YgjFiC0aMb5v4If8oerGUi9eyU8iMNTQyMmLZuK4a6XCPGCB8IrqR3EbmN2Uddrqf1n6tF3SoHaKbfx/rdUcwZJnq6uqCSxpbUPxGgv99rXaglyVMp9M9jGiD5KFfGRoaigvm7LqwBQQj416v95XCBWpZQv5xvXzxc5OFHDNYV2DUx8H6oEf4o2R1jNbLErKmKTbSEciukugHZ6RAIBDYSHcXBRPz2+PxXBJsJx12xkpsEDm4/h4Sa/3/2Cy9HK/zpfLLdmiXnCe7ocnQ30E4YBevbS4NKtVjsZgf0gsSzygTrG1z/kiJ2VYui3BycnKqvr7erOVB3lnIDkH2xpZhJY0c+E4uhaaVrLnitf4A6sAsehavDeMAAAAASUVORK5CYII=";
    },
    78271: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAg9JREFUWAntl79Lw1AQx/0RwR90VNougrgrFAcn0UUQEUdRtOLQmA4i0j+gi7MuVRqK4ODgIi4Krg4OQgf/AilC27kUdEhbv6cmxOOlPZMKHfIgzbu7d/c++b4kr+nrC1uoQA8ooOv6fDqdnusGykDQIoBZabVaT5ZlPRuGsRC0XmAgwMzaEI1GY8bu+z0HBnJP3I/mtv30uwrkB4DnhEBcEW6HCnFFuB0qxBXhds8ppHFClZ1KpTbhP8VxH4/H97PZ7IdqHPdlMpmxWq1WwPtyCTEjn8/f8DHcFimEgrtIHMeRrFQqtwAa5oW4/QNzB/8GtpcJnHf4GJUtAkLBM0A1qQD6y52gXDD2ZttA/rkKgPvEew+WLYmiFwD6ugj0H2Kx2Hq5XD5C0WMqDN9hJBIpYJlIGTfMFpbrmsZ0aiKFqIhpmpeA2cOkv5RCyFk+xOme8Q1D84gVosHUFEq9A2SEYoB1+jBpmcTKUD61we+T/LdYLL4kEokSJltDFl3QkCvb7vuCoTp/BqIkBRS57eYbhgr4AqJED6hAMIGAGNQqbAvLuC19mihf1UQ3Nb4opvF/+QAFRlVFcFNPwt8E0JsqDl9d07STXC5X8og7btHWgS8KExmLTpZHB2AeEchnWVMI0oPQtknfQ69tqwiCgBXVECmEDVWvVqtXmFe5ZAKeejQafRSMC4eECoQK/LsCn7NuxnKjGizeAAAAAElFTkSuQmCC";
    },
    40053: function(e, t, n) {
      "use strict";
      e.exports = n.p + "assets/formal_exam_2f815fec.png";
    },
    44568: function(e, t, n) {
      "use strict";
      e.exports = n.p + "assets/formal_examEn@2x_0468b964.png";
    },
    45342: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAztJREFUWAntl19IU1Ecx93cn9TSiP74EggRBEFUL5llqfUUhUFQIGno1L30EEFvPkUv9VpBuuFI9KFFaP+WUFFIQdBLPQhBJAkVpKCL2lzStj6/sRN317ld73VKsAtn55x7ft/v+Z7v+XdXUlJ8ig6skAPJZNI2MDCwudDd2Yx0MDg4WBmJREaJ3We32w90dXW9MYIzE2PPBwoGg2uj0egT4vaTEjj1Mx/GSntOh3p7e8shFzGHbDZbnLylu7s7aKXDfNhFHcKZMkQ8FDGkBOlcocWI2KyCQqGQe3Z2doTpaUJUkuRBzJAACv0smDKccYXD4WHEHBMxCPAixldoIYo/QxBrxomIu4hpTgf0uFyumyrYTF5TU/OrsbHxj1GsXtA1gJeMgg3GyfqbYqBjpDudnZ3DaeezwjPWEIGbskZZeyl9VOP66UQicc/n873t6+vbvRhlhkOBQGD9/Pz8c4L3CgCBNyCSA9H0w0FaCcd20klI9ggRvBHqZ7xe72M9cYYgafT7/RsYyQsAuwDGeHWCRf1MDzRTx51muP1gN5KiDoejzuPxvNdyZUyZNDDHMwQeRcw4otaQHkDUoAWZLXPl3AdbC3eYvDwejw/Bn6Eho6I66ujomAZ0hPoHUhmgR+zAg6rdSs40fYL7onDAu5MZadHyZRUkAYzmO06JqI8AKyAJ4VStFmy2DHcAvpeCh/uslmdRQRLE/H5jUTZRnAC4jvkf7e/v36olsFC+LVh4G+T8Uzw5BUkQo/lSWloqV8gk1SrmfYcCW8zfpfFup9NZrbjyCpJAFvokIDk76hH4VIGt5Azwh8LjfJUqO1QhX97e3i4741W+uCW0b1GxXE9TqmzIIRW8zHm98OHUTGtr67TiXhVB8q3FNHlFBIs6hCj5qkg9qyKIz5sr9L5NFLBhbqWUpH9WXBAX6ylcuZDuf4QN81oryPCi1oLMlOUvVCwW6wF7niR36ATuePRcCy5XfYBciIzosP79Euqp2574OlLKANbMOMfIcXbuZz1PTkGMqmJubk62+3I5+Rsx13HmMrdA1r9TOQWJeub8KpncaWYf6fgrQsbcbvdIW1vbvzPHLGERV3Tgv3LgLwMuIKNFjHjSAAAAAElFTkSuQmCC";
    },
    88683: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA1JJREFUWAntl19IU1Ecx9uf1M1yI9JE6CmCQJDqpbKsUOghCougoIKgwKkkaNibDxK9tCdlG04JqseMSipNqEikh6A91IMQRJJQyRLCWFtN2tbnZ/fK3dyf272VBDvw85x7z+/7Pd/7O7/zO3PVqmIrRsBcBGx64alUyhIOh6tCoVBUL8aIn0UPqKOjo2JhYWEc3x1Wq3X3wMDAcz04Iz7WQqD29vY18Xj8IRHahW8SQZFCGDPzeQW1tLQ4E4nEKAvUYwmLxXIqEAhMmVmwEDanoK6uLgcC7hOZvfQSmTPBYHC4EKHZ+aw5RM6Usk33ID+ApRBzFjHXzS6mB78sQr29vSUk8B3AqhjPvxIjgtMiRM6sZntusU3NMklkesrKygIyNtrcbvdXPvKHXnyaII/H40XMRb1gPX6Sf/h9wiaxm0T7Lu9SubCZW1aZy9Hoez7QilVjx7Hbra2tLyglW3PxpUWos7PTHYvFnuC8XQH46aUgGm5EowLwZuwIgrYpRFH6E0NDQ6PK81KXJkjectzXRaPRpwzrsO82m+0wlfmxzJltpEQzoq7Csx6LIbZ+cHDwlZZ3mSCZ5NhXcuxFVC2gb9hB9n5C5sw2Ds4mOEKYG5uqqampI+klzxZbZg4tvvT5fHMOh6OJh9d8kSOZTD6AaM8viLm/bNNbPvCCwlI7Ozt7UsuYVZA49Pf3h0tKSpoAv+GxHBtra2vbKXNmG9t0Dd4Jhee0li+nIHHy+/0fEdUIeJrHtdxr45yQjVoCo2M4byjY/VL/VJ68gsSJ7Xtvt9sbGc5gLkRtkfdmG0X3pXCQEqXwV6t8BQWJIzf8jNPplNrRQLgfqWAzPYK+qHhy1KWO7eqgUN/X1zePz7NCfnrnifQGja9U8sWmK0Kq85/sEdSg8H2mzs2p3CsiSH5rIcAjIkjuMWzpblsRQVxPl9EiBVIEBaVXW9ZKrU7+jZ7L9RgnaxiTYIxQKI9q19Gd1FqQkTFCqhDRw4k6D57AWKY5uecyuQpGSLkQ92UC9T6zsHrb1yNIDcAUx/4Q9+O7TJ68grq7u8sjkci8higT/1vPiIsD8Llcrkterzfrv1N5BclqlPUrEMlFa7TJwh+wSXhGiMpSzTFKWMQVI/BfReAnYzMcfkNsqJ0AAAAASUVORK5CYII=";
    },
    20992: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAyZJREFUWAntV11IVEEU/uZqq6XVZtDmDyYmVo8FQkHgS5BEabu2RQ8FQhhkaT33oL72sqb9YPQgRlBJKQsiFLbanz30EAVhQT2FkJAPlqv7c/d0Zta7LOa2eW+7VNyBueecmTPnfPPN3DtzAbvYDNgM2Az8fwyc6KcC9xXamDwz71Xa3NxLq4w27z1yHO8il2GblbnpBnLSNdMh7BUETfrqGt74z4kpqc9+xWMCdnlvkmvglJhx+2hPKIwXXyLo4+4m6ROeQn+IcOywj3YOXRCv1cR01Mg+VXLwafCs+GCYqWRaoNNBNMcAnxGAAQ+y7lm0nSxzMYdCljM8lfVgZy6y3SiGrmQsgk6eXIvRCcIk6zsSdgolLVDSkK+SC0wKqPogEUtwGs4azpVPIKYs1atsqbGidJETl5SDERFDKTfmc0sdu+SpEWkeaYEa4zXCXV66DsOWkoFfFBq2Dp7BZ8EcFWqY+Ebo4D0ymvATuMR+E4VOvJJt/lYxzGLY00vF0SDUFkr4/kL5baDLxRg6L+7LdtEW773dKmZZ64xb8ae/TQRYk9VSUS+IpQhZGmwD/dNEZ41R+dFv6KZ9ZieQFaCebiqbIzwjHY9Y320GbMaBei9TeVTHOIOr4vq8wIm3fx1QPjYrwqRAVgqBJ3kO1N06KeayCtTdTbXu67QpVdLGa1QZExgnQgWDDKwrwoGBFvE9lX+6dlNL7+miGj2GQGwBT+t7qGRpEr5BVUXDzCShnEGOulbjoFkmjdimgBYU4R0fiy/5vK4WUQTkcWgE5NtRdTiimCxjn4eOEhy6cVoEjX6z0hRQyQ6f63V82Cuw+nwcbGMPbefb0Rgvdwn3jWxwomHgqJg3Cy55nCmgMoA819dq2K/AErbpQYxFdAYJFDOTw1s0uPuaxEJyMiu6aaA/geVtwHvSxXvS7yiFp6dVhKwAWzrWEtBksPLzw/UOvzhHeLnDSxNZtS1d84zki9e7WsPOhLTMaCZALRfTBrocK1ba/hlGf/tl4r/g9noftVthJXks/9itqKQFyqfMR/6oy7CZYv/9ihDbzjYDNgM2AzYDphj4AWL9/GlmFBVzAAAAAElFTkSuQmCC";
    },
    37002: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAA3JJREFUSA2tVktoU0EUvTeJaQVRm4WatIoFwUWFbkRXRXFRKKhoQUUXUlHxU9MqiFBX7U4ES5v6VxBRF1ZQ8S8ILsSFG3EjihXqJyaKtFilFY1545nIHe9L06TWzuaeM/dz5vNm5hH9R6vpNeHlD03oX0r8U7AuvCBhpg+k6NpgipLGmCZmNto/Fp6Q4NweExv26A6K1lqVWDd9gWkdS0T3BzQZL84SVSN2ocRDtCXWbQ4IL2a5mLOYL5YwqzyPriImt0rM9CMYokXJZn5dLG/cM4x1ma3zz5lyKZZq4ZsQiQs3hsqyGUoIH8uOSzDabTo9orM/huhSuzEuJ93KJyH6SIpjaRsqu8xK4YWsSy7ktH2YWQdGv89iFGw83U27LZbGQdpLbF1/WpZph+BCtqRggOkiZjEgyajcUXXWRISn9vBTHIh7woHrsfQzhefbkoLJVu6D6H5JhGAkO0xNwq3FgOzHk2vwhzPfaI3wfDtKsKrXTMWe7dSByTidx+f8QvpQdINga8MhuqWX1TO0Qvs19gnWHDPTsmm6iz07AdG1Epi7RZiuC8eOLcZNUyb8TTN/xIDccUD+XPHlWyc477ipGMjQAwQvywUZ2qyDUfCJ4oERpmrFLfykeJXCPugEMxm6DM9S52WqcRjAMA1qjn2r0Bz4s3AMrlJwvnWCHKAWBH6QAOzTO8HWBjyaoXmQ6KvmPsw04uOKOMFUnF+Gg1SHze+3fszgioojHPe/M8a588oprf3YV73ESZ9PESdo+97GuT8Upjocg/M74nRGxRG+vEbFnye3sW+J4ZsvfqzOe8H5dtTzlNzFdlmb2tVjg4u6Hhf1Epds6LbDAJUJU5v1yB12bE2f9mvsm6F2CLZvH8QuCEexn1OC/ks6a2iT+HOW6ZqPK1JS8JdH9p2b5XKYjr6Pc0r4ul4TxHW2UTi+gRS247HjeaCkYDBKbZjVfZsH+zQCrms8TtMW7Jk76Ii50s6Mx6VwKymYXM/fIzFajQ/pOJ7axufr+aeUqu4ysyF2WDjsMIfoiOKjIAY0sYYfJ44m6AaOg3v/MKi2VCsfKlax5AwLJVsx/Did0mI4t68qotRZKF73TUgw1kNrsZTbXSGmoUCINujldr48MCHBdAtfxYwO2lqwIyiy8kMzP8urPfl0TsJsntNjGia/8iRW/A2Fhv1vcv5dXAAAAABJRU5ErkJggg==";
    },
    46772: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,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";
    },
    51406: function(e, t, n) {
      "use strict";
      e.exports = n.p + "assets/mack_examEn@2x_22f01507.png";
    },
    67246: function(e, t, n) {
      "use strict";
      e.exports = n.p + "assets/mock_exam_93a68ed1.png";
    },
    8248: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,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";
    },
    32475: function(e, t, n) {
      "use strict";
      e.exports = n.p + "assets/photo-calibrate_f1c7c61d.png";
    },
    35755: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,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";
    },
    41260: function(e) {
      "use strict";
      e.exports =
        "data:image/gif;base64,R0lGODlhHAAcAOZqAPr9//7//9vu/+j0//f8/0mo/zqh/xmR/+/4/6HS/1Ks/+f0/2Gz/12y/7bc/2+6//X6//D4/33B/8jl/x6T/6nW/1Wu/+Lx/6LT/0qo/zGc/zaf/yqZ/7ve/3/C/1ev/6XU/0Ck/4TE/2O0/1uw/4bF/5TM/4vH/ymY/3m///j8/yya/2K0/xqR/yKV/7jd/4DC/z6i//n8/0am/+Py/8zn/5jO/97v/1mv/0Ol/8Dh/57Q/yaX/8nl/7Xc/1St/3S8//z+/yeX/9Lq/zuh/9js/265/9Tr/6bU/73g/zCc/5XM/5LL//P5/+Xz/1Cr/x+U/+v1/yGU/5PL/4PE/xyS/6fV/9Xr/0+r//H5/6rX/0Sl/zOd/zmg/yCU/9nt/yiY/8rm//3+/7re/225/3zA/9/w/+r1/xiQ/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyNjhlNDUxNi0zYmVlLTQ1NmItYjU2My01OTFlMTI1MDg1ZjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkQ4MkI0N0U4ODYwMTFFQUFBNDBCOTYwMkJFREFEQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkQ4MkI0N0Q4ODYwMTFFQUFBNDBCOTYwMkJFREFEQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDU4YjY1ZWMtMzUzYS00MWRjLWJjNGUtY2Q0ZTc5MjhlMmU5IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MzY3ODA4NGMtYmMzZi1iOTQ4LWE5ODEtZjM2NmM5ZDk1ZDg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEBRQAagAsAAAAABwAHAAAB1qAaoKDhIWGh4iJiouMjY6PkJGSk5SVloNpmZeZBAmalWkQCmgOn5GZERloaAymkJkfq2gGrq8CGqsWtY+ZFxtoGLu8aQsPAWmXapnIycjMydDR0tPU1dbXk4EAIfkEBRQAagAsBgAEAAoAFAAAB2uAaoJphGmCg4RWKoaHhB5oIwGEgydoljuTamk3HJYoCJOEFZZoNoyaaTGWBZmaJZYtMqdpL6QCsxOkNbMdpEWzJpYHoIgFliGZaTqkIoxpAyuWFAOhEqQwzmkEOGgzAKeaACk0rYjliIeCgQAh+QQFFABqACwKAAAADgAcAAAHqYBqgmppAEFpaYOKhE0/RoiJi2kDOWhoZYiLhGFelmhLkZJjVZZQZplqSINpCZ4kqJJPnh2himlDB5YNsLYklhRZtasgnhXCgmlnuWhkvMhpBpYKx4RpWJZdzsgsllK8X9uWHNqEW5Y52ohCuulXnh7UaVSeE8dpYlyWSgH2xJYS9qKAseTCiTBEDTxN4YUIiCciAGAh8uGJx5F0TNC46EEOkZYk5J5RCwQAOw==";
    },
    66888: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABW1JREFUaAXtWltInEcU7mrSpC9as95bmxWNd6hWC5oKClIIooLik+BDrCLeQJCWri99KFJZEAW1tmipL/pQhMULEi2lWtQI0dQHWWw10UZqvXQtSqnGVO35Nj3LdPPv/reF7EIHZs/M+WfOOd8/Z+ac+dXwyvPyGpEUqkaq156zfPb3KVlmp2qjemKgHxifR/UqVX8qz8jY2UD6eZvq6/5k+b+2wvbrAfQDt/HXYgQAX/d5Ty/3GgD4dfkfwMteviveMiA8PPxKU1NTgslkCo2MjLwBubu7u4dbW1u/d3d3/7y/v/+3t3SJchAHikWG2nZvb++7hYWFBTExMRmBgYGIKS+U8/Pzk+3t7R8nJye/a2hoePDCAB0MzQDMZvOt5ubmD+jNI4IrLrQSts7OzoH29vYNxZM8DNQEYGxs7E5RUVGtwWBAMHGW4+PjJwcHB5tHR0eHYAYHB98ICwuLDQoKess5iBqXl5fnExMTX5aUlNwT+VraqgEsLS3dzczMLGVlFxcXz1ZWViY6OjruDQ8P/8Z8kVZUVES1tLTcSU9PLwoICHCmLMvLy9asrKyvxbFq26oA4M0XFxfXsxK73f5TTU2NxWq1HjDPEy0tLQ3r7+//yGg0JvK48fHxz/WsBFzAKYyFSlH4fF1dnZncxhE7Njc35zMyMj6lt/in1Hgp3tra2l+Dg4Pfl5eXvxkSEuJwq4SEhHfOzs4ezs3NOdxOap4nnuIV2Nvba+cNizefkpJiljoaBwYGcvLy8nKgdHZ29n51dfV9VwNw5Npsts94JbCxIyIiPnYdp6SvKBLjqGTj4fNwGynjoTA5OdkUHx+fj4q2lBGYCxmQheeQDR1SY+V4igDgnGdB2LBKfZ7nSFHIgCx+JupgnhIqCwDLjSDFwnDacFsvFWVBB3SplSkLAOkBR1ic8+6OSrWKMR6yIBNt6IAutNUUWcTIbVggghS3QbFh8/Pzb4u80NDQm9xPTU3N2djYiOY+KPm6lSLxY+ZBJgc6URc/l6OyADgxgyCOsCw0KSnpZlxcHO7TkoUisQlVfEib+wfqOwGIMkVd4hxPbVkX8jTZ288oxbhUK1N2BZASs1DkNtwGHRoaWqCAtiPycnNzb5MrONyKUukFClAL4vPR0dFHYl+USbHmD/GZkrYsAOTzLAiJGbdB+/r6nqCKvPn5+TcYwM7Ozi+VlZVwGbdFlCnqcjvB5YGsC+Eygnwe87DZkJi5yNDchSzewNABXWqFyQJA1MRlhAUjq+S2XirKgg530d2THlkAmIybFAtBSoyskvtaKWRAFs8XdTBPCfV6MtfT05NFscGR18zMzDxobGxccjUEEddbyZxiAEin29raLHwLQzqdnZ3doXbZYfzi4mJLbGzsewCG21lra+uHWq+Yiu8DyNfpJnaUmJjoeLvI56uqqtLX19dXkOe7vmWpPtxmamrqk+joaGduRan5WllZ2TcaQoBDhaI9wMbg5oRrIPeRz4+MjHxBvLueTic8wxiM5TsAy6DUI2V1dbWRciFmqaKKXUiU6o1LPS5FMJ7l0ip+m5aW1k3HKbMUUU0AIFnPZ5Wurq6vLBbLOr35Jsqn3mdLtYDQDICV6vmwBbfRC0I3AAYSFRV1tb6+/hZSYs4qlXxa1AvCawAYiBaqB4SqU0iLcUrmYONiA2MP8HjsDbiX3OnkEwBgtFYQPgPAHQjaU5kFBQX/uYfwKoH6FABXEKenp4e1tbWt09PTzkuVaDzaPrGJXY1CH76PN+/JeIzzWQAwTknxORdSYrQ4BgDwvwf+Wp4CAP5xwl+LHQDwXx+Or8R+hgI225CE48+fv1K9TvVVqrKfWmjMyyxw+X2quKqe/ANC0ooCitNHSQAAAABJRU5ErkJggg==";
    },
    55132: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA4pJREFUWAntV11IFFEUvufOmFZaEhKV/SiVmuVDQZS5LPYUSBD0EEGUSZHQ0tZDjz321EOhtYERSIhP0UMPBtWL2boFEtmPWlGoGREZIWmx6szczplxhnEZ79y1J8kLu/fMOd/33W/PztyZYWxxLLAOwHz8DrbWFqYnjDqLWXuZxdbZGpx95Yw/z8vXH5Q2dI7NR5c4WRkauX1g1fjvX5cYwFkhRG7QogAwyYS4WbB8xeUNpx/+DMLIcsqG+pqrd6L/+7jYBpmgVwMYYUwc2h5/9tLLKQRcAcMGrker0EyXawa7kAYGVwB4NdeWFdGHYicHaVvTNg5dDldlFQcT2qHvidr8H8bkG8FYyQylJ0fX68tiXQNBy3xIRLdNG8Yd7M5uquMCQ0V6btXqWOdEED4zF9qhUWPqomsGxV9Xri2OzGWGxKlGGMLSMXFJg2KVITUkWs7kAIgLthCwaQ20E3Dk7lSYMGF0HeqxPdOEJQ3SCuNRXWpoYLqvVgi20hYS0FoeT75SESVMWSzVy5BDMWmQFsVhQ2qIWWKXK6Bx6HBj1XkWx6cl40sN4XngbHqoIJg2KBMKqvk5fq0grJuTGrIE/PGAQix1Y9WZ+zh+LRlfagjPsGGXbIBZ5saqsynMchfLgQ25sWyWGtK5eOGSQbCjbpzF7HEAmKcl4+NfKx/9TftwUxQ7EGhxrkcrzj3tljOc6vtEJGIa5hPch7A58LbyfAp3+/Ah7RDRBYhr9ozCljDaPiaiofeyTy2RjWimjcwQl3N2lWaVEdohEsEudWCX6mxBYF90DQ6Xx1I9QQv03YjsAdO8h2aKqY73vY7KeOpgEDYoF9ohIuWAdhKleynG63+9YbCUc/e3M96XnTOtpGuGODlMa/AACoGSoa3xp6NaPkRxgaSjKXRN8MJMfScndCcPSeIQNxMnO1YyRAIVp7rHgYtHMjF/jbDE8edU4plfowKdjbFANPQ31ez3ZzFXQrf3fxnZGcJLjk4iGvgIe9yNPQN+MzbWqygHyn8ZKQrOH7uPFNIV8LHDxkpBwUWly95PHUzUrplixhZ/LjNewvSPpbHOb5n5BXmcdYfoV4Y9/UHjLftJcT4dydoQ3RbSaXNYtlhenrZpc2PyswwzVy2rk5pErMmCMftlcA5FqhFmjnJoOusOkeK75ppj+Bp9DHdubfYKwsTX6faKeHf77Pzi0WIH/uMO/AW7ySFaMTJMkgAAAABJRU5ErkJggg==";
    },
    75572: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,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";
    },
    33146: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAyBJREFUWAntl0tok0EQx5vEtIrQGq0VhAheCopGEQ+C1OpBqRERPBQRRBr6okUQLIg3e5PqQW8maRIjAfHoK6WXogdFBA/1Ua/FFkRQD0UhMS9/E7Mfm2e/pI0UzMJmZuf5z2R3dtPU1BiVK2CprK6s9Xq97Var9Ww6nXZZLBYb1nN2u/1JX1/ffGXP8tqaAQHmGCAeZjKZrXp4ZL+YwwMDAxFdbpavCVA4HN4Si8XmSNJB8tfQZwBLwh+BnmQdp1IHPB6P2FQ11lVlnTOOx+NnYAXMGypxGJrOqW74fL4HgDqXSCQuILuWk5smVtOWmiEJ98oSOqWBURZPhUHuUoJqaE2ASNAiSdjQvwuTASSekzUX6sysawVkJnZNNg1Ay5WtUaHlKpTXGP1+/3GugTGcdnFa5CooN9o48htRLmH3UzdCvoG1gxlH913X6Tx20kg/MSfoZTNKZwCanJw8nUqlHivFv6IAypDr1ODg4JTkNDo1YMZFgMF9+sttKlXUY0S/WoMczeQco1LnyXmduPmAEHailHwT/f39H4Wp9+CauSmAyNOpchkVQvCeeQiDW+ylu9C6Voj40u1HBAj8B6EyDECU8Co/0zTKHmjPX3V9P8klWyQGNS5hY1NL6kAgsC+ZTEZg9zDnmV+Y9RhtBN0NmK/ME5yydypJHiAR8vC6B7mI4WV2/h2RrfZg73RTlefEnR0aGtqvx290ar0apfhGhUpVRZetuQoZfUhHWYqPRqMtCwsL3U6n84Xb7VbP1KwpjXQnzGaO71vdl5Nk4UQdtdlss3T/H7quHG+6QouLi6MEmYYOFwajkU6R/FUoFNqk6+hrXaxnuLNMtw/TgAi8LZdMUT13B4DkUZ8HCCBZW3paKR/d3+CrAWQ41ZNZc4CKNjXlXaL8UgQX18gO/hJnF9xxrSJE1xoMBp3Cq8G/1OzrErodXUqTt+f49boPdgdFLrmUraJFgFDIq/ESiT1QD87KVtFRZLLBiwY+L0vYy5foQv650AH5o0JZ0eUqBhxVD8ZX+AZ5lSh0XsH6G/EjDodjvLe316joCuL9R65/ADjONIf5xwsYAAAAAElFTkSuQmCC";
    },
    53655: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAxpJREFUWAntlktoE2EQx/MiqQRaH7USQcGDgqKtiAVBahWiVEQET1IQwUOaRwM5FMRbvGkVotSS5CZSEMnJqoReih4UkXioj3iToqB40EPRkKRp4u8Lu8uX3TbdhER6yMAw883MN/Pf2e9lsXSofges9d31vT6fr9dqtV4kqh+2w1nGTxOJxCJ6U9Q0IMCcouJjeLuu8l9A+ZPJ5IzObmrYFKBQKLStVCplK5VKH8XfUOk5egl5Aj6LrYA8AqgssiFyNBStBK+srFxQwLz1eDzHo9FoWXHdpHOP8F1ifBm+rthNC5vpSCmQgofEkE6kJTDVCJvN9kzxiXXVMDULyCUqlcvlor4iYMXvsiCdep+ZcVOAzCRuNqYDaL3OdTq0XodqDsaxsbHT7I4JtvN+pLgK1qIeHG7iloj7Iwdh24RtC7KA/CX7dHqJmM/wJFfNvOrTAAHmPAlmVcd/lBW73X4uHo+nRU35pL4hDCB+CN8lyHDGCH+riNPeyTk2Qb5RZBRZC4ju7BPFHA7H5PT09Ceht5uCweBt7sRRtbaop3WIrnzAcYyAO/y+BFdAuzvkoktB5aM/qh+vAcJwDZ4D1AhyhGA1pm2SWiJ3HtYuYW1RCw+dGUDMEHiQji2i/4DbQT3UOEDin6zVMyzo92qRGkDCyPPhAeIKgCK8Z+4JW6spEAgM8wdeUGOBGofl/J2TWu7GanqnQ6t1RbZtuA7J55AM1KCHw2FXoVAYdrlcL6empqrPVDVofHx8D7tmK9v3nWoTkq1t5Sg56Xa7F2Kx2G/Zt5ZuukPFYjFEkjmkX59seXk5DaDXkUhks+zz+/1DjOdzuZzp48M0IL52h1JMlXLtPgbOfD5fA2idOfJ8TTcNSJvRZmXDATIsao5z8QoUC7Kfa2Q3z5HqDcga6RZ2qJtnwy65Ufiqr0teCDvxabcyL4deJa5LnoP9qGJfkvMI3QCIpLMUCOO7KpjJIk4jQIWwiQVuIOyvDEYMzBnC91Xvw/5EbzO8mzOZzJfBwcFvBO6Fu2DxLmo1fyfnfa/XeyuVSlXbzrhDpjrwD7o+TYK3GTR2AAAAAElFTkSuQmCC";
    },
    46327: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABSRJREFUWAnVV29olWUUP+e9k7mNhE2l7TqkQioTFjisrDAWGbq0LFMLSoSgKau7RVJQ1JYfDOlDc26EUh8iDbn7kJWEaKZRSRRWWDZMp/3Z7rRa4J/cWve+p9/z7p7nfe97/y7oQw/cnfOc8zvn+b3n+TumElptl+wGbE0J0AkI0/tn2/jeUvBOKaD/EvP/IFBZQS1V5XSl+THT67kqAvsuxVROpUdzYXLZynIZw7bTLXxebXVdcln1kBwd2MC/hmxFu1wUAcCcbim/RLSchR5C9x4RmhqOQ6JxYvoIMl5dR7uOr+bxMCZXvyiB6DZZ4aboVQRflStBThtTAovr6UQbm91TsOUlEN0ulTJGO/G192dlYBJUYwRf/Dt804VoBgl6oeYwvVbJ9NSpGP8VctluVpDxYPAZ7ijthXqzRRK5GCKOgPjMatp/bC3/qb76uFS452ixuLQKZB4GmYj6gP8K89V8pp3PqS0oswg0bpcpQ6P0MUALFQjQZ5EIbRh8kr9VWz5Z1ytzJUm9INFkMUyH1sfork5m19rSStY5kBijLfD5gzO9Ea2gpvDgtd0y0/zCCYdbuf/6Brob1eq1PpDZ0U2dth9QMioQ7ZH5bpKOBvx9w220hhkzjobdMO2y0EZ8xiP4wqvZoc3DMX4+gM9QsWXfRODatNElh+48G2NTXdsyKiApetF6mAacClqng+M+WHBJqN8VesEMbnEFlCqHHscB9X0a4mACNoXhlkB9r8zBir9PAVhFzyVa2Dt0UOobYD+IgaPqL0Wa1e8IPatYVGPRrG65UftGWgIo/VJ1gPXPgzHqM30RMUvnLahXqH8ycqid92KeT2hMSmiF6kb6BAgLJ93A9F0tff02akZ/vvr+jUT8Ho0DmdtVN9ISgONadcD4uequ60+L2iYrnYifD9N8TTDeEsD81qjDcSihOraTJWZtk1SwDvx8RLM7Rey4/m3ImGPUyjRhskcnTOUT1hx/XVpft1UezOExpv7hNvbmGzlsPuMIHkiWAECGpbe9UPY6A/Sa0C+Qt6R7GQIxNcHKZTiZTmrfZapVHfKPgO6vASQ6Yx1Cc1XHjvhQ9clIrKkDFp8is429BntwOnwCmPevFYQvsw/KKqbdCDK3XumN6TwW3k4NwJQuVx1r6pDVodjFACUecCyo75IG08dhcgFVaAv4iqrItXHoCR4xwFk9YhbxokDQ/oDuExiM8RdgN+A5cben2LuUvC4eFm+jQs/Aj+IUaQ51AG/fjXjMbEaUXs8/XteQOaW2AiYtrpxOTY/9uiS6VVq1n4jxK8iyGNPxjdoyJNN3qNRSXDab1I5jdx3yrNS+ubwON3FS+0Yin9/MsRvtpk8RdGvamkTS1dhO7/gobOQemZd08VgR7yU0gq/4crCdjwUx2J5L0N+DXN42NsRxrd90tIX/DuIyCBiHmTOU7QgCp3vAibJ34I5/Ocw+mEj1VXGJfJKgdnzaFlt6pgtlZdQ42MqnFKcyi4BxgMRCXE4HMeEVFsj0A8AvVZfRe8dbGY/kzGaeZckELYO1A7956kXMKMg8gCruU1tQ5iRgAB6JFMVRifqMAKYx2I4g6U+w/4YEplKz8bsN9soQdgQP02VDMbZ3S9Bv9LwEjNM8TvEy3oHE2S9jAyjc+pwpeJq3sjlJ87aCBDQKC6oRunl6NYNM3rsByUy5P4g41IM35GGNLyRLIqAJzP8K7jjd4WAHuPhfANu2BgNexE45jfVycloVHTjxGF9UfCnyH9/Tkb/EB2diAAAAAElFTkSuQmCC";
    },
    9549: function(e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAVCAYAAABCIB6VAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAG7SURBVHgB7VPRTQJBEH27aPxTOvDoACtQCgDPCoAK4Ez8Rr9MNAh2QAmHFOBRAVKBRwfoN3fjGzgIXO4g8ZtJNrs7u/N25r1Z4GiJmX2HtZ50eMHJOhPBjzXo+54JDwK7PSligfIy8AStWFAyAh/ZkY4YXBYWeNKt/2CCXODqmwyMwS2Xcw7HAhVmFCC/IuEUchS5+Bp5prI+szuvGFxLDO/DM6U0iFbD4aT9+rhd4C5NmU3dmyPD3GdxYmASkRb3Rcrp88gsMw7zgQVTZr0TqEDRGXwGvhcM2tEpetWuNLBbadnuA6bKA7Jev1ER13a6CihQH+VbSy5YBFthRaLU6R/mAmsg5RifA99bPqUnZMYdbb/EF67PSdEnpzF9fi6w2ujeuHSqGPMoXtGiFBBgSv+MY9leayH1LsVupHFyP0itK49a4i9wFayy3ph2CIUMSN1k6JlmVrzNA7YWfU5z0jJxX+VmA8q1glKwC5Nkn2V7v7Rmxt/XV0ETl2ZeZJCK2Mz7zgeBdx6I0WZ9LZZY8lPU/CdjR7tB1xTP4eUyh5/sh6NUJ2zbCQ4Yv/gsyUDnsSR+9vLBrI+2tD9OUqJu1vXrywAAAABJRU5ErkJggg==";
    },
    25893: function() {}
  }
]);
