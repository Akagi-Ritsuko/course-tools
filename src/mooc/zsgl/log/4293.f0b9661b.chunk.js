"use strict";
(self.webpackJsonpintelligent_portal =
  self.webpackJsonpintelligent_portal || []).push([
  [4293],
  {
    64293: function(e, t, n) {
      n.r(t);
      var r = n(18489),
        a = n(84322),
        s = n.n(a),
        i = n(33032),
        u = n(20042),
        o = n(67294),
        c = n.n(o),
        m = n(18463),
        f = n(52543),
        d = n(30381),
        p = n.n(d),
        l = n(47707),
        x = n(66045),
        v = n(92559),
        h = n(13730),
        g = n(55979),
        b = n(41603),
        I = n(91155),
        S = n(48837),
        y = n(5269),
        Z = n(76138),
        E = n(62152),
        k = n(67001),
        w = n(37200),
        q = n(20849),
        N = n(9057),
        L = n(58085),
        _ = n(24145),
        O = n(69134),
        B = n(63468),
        R = n(18041),
        T = n(22380);
      t.default = (0, f.Z)(y.Z)(function(e) {
        var t = e.classes,
          a = e.match.params,
          f = a.examId,
          d = a.trainingItemId,
          y = void 0 === d ? "" : d,
          A = sessionStorage.getItem("isPublicExam"),
          F = (0, o.useState)(w.Bc.empty),
          C = (0, u.Z)(F, 2),
          P = C[0],
          D = C[1],
          M = (0, o.useState)({}),
          Q = (0, u.Z)(M, 2),
          W = Q[0],
          Y = Q[1],
          $ = (0, o.useState)([]),
          z = (0, u.Z)($, 2),
          H = z[0],
          J = z[1],
          U = (0, o.useState)({}),
          V = (0, u.Z)(U, 2),
          j = V[0],
          G = V[1],
          K = (0, o.useState)(!1),
          X = (0, u.Z)(K, 2),
          ee = X[0],
          te = X[1],
          ne = (0, o.useState)(""),
          re = (0, u.Z)(ne, 2),
          ae = re[0],
          se = re[1],
          ie = (0, o.useState)({}),
          ue = (0, u.Z)(ie, 2),
          oe = ue[0],
          ce = ue[1],
          me = (0, o.useState)([]),
          fe = (0, u.Z)(me, 2),
          de = fe[0],
          pe = fe[1],
          le = (0, o.useState)(!0),
          xe = (0, u.Z)(le, 2),
          ve = xe[0],
          he = xe[1],
          ge = (0, o.useState)(!1),
          be = (0, u.Z)(ge, 2),
          Ie = be[0],
          Se = be[1],
          ye = (0, o.useState)(!1),
          Ze = (0, u.Z)(ye, 2),
          Ee = Ze[0],
          ke = Ze[1],
          we = (0, o.useState)(!1),
          qe = (0, u.Z)(we, 2),
          Ne = qe[0],
          Le = qe[1],
          _e = (0, o.useState)({}),
          Oe = (0, u.Z)(_e, 2),
          Be = Oe[0],
          Re = Oe[1],
          Te = (0, o.useState)(!1),
          Ae = (0, u.Z)(Te, 2),
          Fe = Ae[0],
          Ce = Ae[1],
          Pe = (0, o.useState)(""),
          De = (0, u.Z)(Pe, 2),
          Me = De[0],
          Qe = De[1],
          We = (0, o.useState)({}),
          Ye = (0, u.Z)(We, 2),
          $e = Ye[0],
          ze = Ye[1],
          He = (0, o.useState)([[]]),
          Je = (0, u.Z)(He, 2),
          Ue = Je[0],
          Ve = Je[1],
          je = (0, o.useState)(0),
          Ge = (0, u.Z)(je, 2),
          Ke = Ge[0],
          Xe = Ge[1],
          et = (0, o.useState)(!1),
          tt = (0, u.Z)(et, 2),
          nt = tt[0],
          rt = tt[1],
          at = (0, o.useState)(0),
          st = (0, u.Z)(at, 2),
          it = st[0],
          ut = st[1],
          ot = +$e.isInvigilate === w.hn.YES,
          ct = (0, o.useState)({}),
          mt = (0, u.Z)(ct, 2),
          ft = mt[0],
          dt = mt[1],
          pt = (0, o.useState)("home/myExam"),
          lt = (0, u.Z)(pt, 2),
          xt = lt[0],
          vt = lt[1];
        (0, o.useEffect)(function() {
          yt();
          var e = "horizontal" === v.Z.theme.id;
          return (
            vt(A ? "home/publicExam" : "home/myExam".concat(e ? "/push" : "")),
            function() {
              sessionStorage.removeItem("isFromCourse");
              var e = document.getElementById("examWatermark"),
                t = document.getElementById("examDom");
              t && (null === e || void 0 === e || e.removeChild(t));
            }
          );
        }, []),
          (0, o.useEffect)(function() {
            return (
              location.href.indexOf("data=") > -1
                ? (0, I.xG)()
                : sessionStorage.getItem("dataString") ||
                  sessionStorage.setItem("dataString", (0, S._)()),
              function() {
                sessionStorage.removeItem("dataString");
              }
            );
          }, []);
        var ht = (function() {
            var e = (0, i.Z)(
              s().mark(function e(t) {
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        +$e.isFinished === w.hn.NO ? Zt(!0) : Zt(t);
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
          gt = (function() {
            var e = (0, i.Z)(
              s().mark(function e() {
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        Pt(w.Bc.exam), ot ? te(!0) : It();
                      case 2:
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
          bt = (function() {
            var e = (0, i.Z)(
              s().mark(function e(t) {
                var n;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (
                          ((n = t.attemptId), se(n), +$e.isFinished !== w.hn.NO)
                        ) {
                          e.next = 7;
                          break;
                        }
                        return (e.next = 5), wt(t);
                      case 5:
                        e.next = 9;
                        break;
                      case 7:
                        return (e.next = 9), Nt(t);
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
          })(),
          It = (function() {
            var e = (0, i.Z)(
              s().mark(function e() {
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return he(!0), (e.next = 3), kt();
                      case 3:
                        return (e.next = 5), St();
                      case 5:
                        he(!1);
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
          St = (function() {
            var e = (0, i.Z)(
              s().mark(function e() {
                var t;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (e.next = 2), q.Oe.getMaxUploadSize();
                      case 2:
                        if (!(t = e.sent)._failure) {
                          e.next = 5;
                          break;
                        }
                        return e.abrupt("return");
                      case 5:
                        ut(Number(t.body.maxUploadSize));
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
          yt = (function() {
            var e = (0, i.Z)(
              s().mark(function e(t) {
                var n, a, i, u;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          J([]),
                          pe([]),
                          (e.next = 4),
                          q.Oe.getNewExamBreakInfo(f)
                        );
                      case 4:
                        if (!(n = e.sent)._failure) {
                          e.next = 8;
                          break;
                        }
                        return he(!1), e.abrupt("return");
                      case 8:
                        Xe(0),
                          ze(
                            (0, r.Z)(
                              (0, r.Z)({}, n.body),
                              {},
                              { reconsideration: t || !1 }
                            )
                          ),
                          (a = localStorage.getItem("empId") || "") &&
                            ((i = document.getElementById("examWatermark")),
                            (u = ""
                              .concat(a, "    ")
                              .concat(p()().format("YYYY.MM.DD"))),
                            (0, I.W$)(u, i, "examDom"));
                      case 12:
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
        (0, o.useEffect)(
          function() {
            void 0 !== $e.reconsideration && ht($e.reconsideration);
          },
          [$e]
        );
        var Zt = (function() {
          var e = (0, i.Z)(
            s().mark(function e(t) {
              var n,
                a,
                i,
                u,
                o,
                c,
                m,
                d,
                p,
                l,
                x,
                v,
                h,
                g,
                b,
                I,
                S,
                Z,
                E,
                k,
                N,
                L;
              return s().wrap(function(e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      return (e.next = 2), q.Oe.getNewExamDetails(f);
                    case 2:
                      if (((n = e.sent), ve && he(!1), !n._failure)) {
                        e.next = 6;
                        break;
                      }
                      return e.abrupt("return", !1);
                    case 6:
                      return (e.next = 8), q.Oe.getIsOpenHumanSocietyVas();
                    case 8:
                      if (0 !== +(a = e.sent).code) {
                        e.next = 35;
                        break;
                      }
                      if (1 !== +a.body.isHumanSocietyEnterprise) {
                        e.next = 33;
                        break;
                      }
                      return (
                        30, (e.next = 15), q.Oe.selectResourceRule(f, 30, y)
                      );
                    case 15:
                      if (0 === +(i = e.sent).code) {
                        e.next = 20;
                        break;
                      }
                      return Ce(!0), Qe(i.message), e.abrupt("return");
                    case 20:
                      if (
                        ((u = i.body),
                        (o = u.learnAble),
                        (c = u.resourceFlag),
                        (m = u.isCourseExamFace),
                        (d = u.isLearnBeforeAuth),
                        (p = u.isLearnRandomVerification),
                        (l = u.isRealNameVerify),
                        (x = u.verificationType),
                        0 !== +o)
                      ) {
                        e.next = 25;
                        break;
                      }
                      return (
                        Ce(!0),
                        Qe((0, O.vs)("go_training_programs")),
                        e.abrupt("return")
                      );
                    case 25:
                      if (2 !== +c && 2 !== +o) {
                        e.next = 29;
                        break;
                      }
                      return (
                        Ce(!0),
                        Qe((0, O.vs)("need_accept_oversight")),
                        e.abrupt("return")
                      );
                    case 29:
                      if (
                        1 !== +m &&
                        1 !== +d &&
                        (1 !== +p || 1 === +x) &&
                        1 !== +l
                      ) {
                        e.next = 33;
                        break;
                      }
                      return (
                        Ce(!0),
                        Qe((0, O.vs)("go_app_learn")),
                        e.abrupt("return")
                      );
                    case 33:
                      e.next = 37;
                      break;
                    case 35:
                      Ce(!0), Qe(a.message);
                    case 37:
                      return (
                        (v = []),
                        n.body.timeLimitJson &&
                          "string" === typeof n.body.timeLimitJson &&
                          (v = JSON.parse(n.body.timeLimitJson)),
                        Re(
                          (0, r.Z)(
                            (0, r.Z)({}, n.body),
                            {},
                            { timeLimitArr: v, reconsideration: t || !1 }
                          )
                        ),
                        (h = null === n || void 0 === n ? void 0 : n.body),
                        (g = h.isExamType),
                        (b = h.isSubmitExam),
                        (I = h.isPublishScore),
                        (S = h.publishScoreTime),
                        (Z = h.ishasHistoryScore),
                        (E = h.markingStatus),
                        (k = h.testType),
                        (N = h.hasHistoryScore),
                        (L = (0, T.y)({
                          isExamType: g,
                          isSubmitExam: b,
                          isPublishScore: I,
                          publishScoreTime: S,
                          ishasHistoryScore: Z,
                          isSubmit: oe.isSubmit || !1,
                          markingStatus: E,
                          testType: k,
                          hasHistoryScore: N
                        })),
                        [11, 99, 53, 33].includes(L) && Pt(w.Bc.info),
                        [
                          20,
                          21,
                          23,
                          31,
                          32,
                          34,
                          35,
                          41,
                          42,
                          43,
                          51,
                          52,
                          54,
                          55,
                          61,
                          62,
                          63
                        ].includes(L) &&
                          P !== w.Bc.transition &&
                          Pt(w.Bc.result),
                        e.abrupt("return", n.body)
                      );
                    case 45:
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
        (0, o.useEffect)(
          function() {
            Be.reconsideration && gt();
          },
          [Be]
        );
        var Et = function(e) {
            var t = e.questionId,
              n = void 0 === t ? "" : t,
              r = e.index;
            return {
              questionId: n,
              questionNo: (void 0 === r ? 0 : r) + 1,
              answerList: [],
              done: !1,
              hasSubmit: !1
            };
          },
          kt = (function() {
            var e = (0, i.Z)(
              s().mark(function e() {
                var t, a, i, u, o, c, m;
                return s().wrap(
                  function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (e.prev = 0),
                            (e.next = 3),
                            q.Oe.queryNewExamPaper(f)
                          );
                        case 3:
                          if (!(t = e.sent)._failure) {
                            e.next = 7;
                            break;
                          }
                          return Pt(w.Bc.info), e.abrupt("return");
                        case 7:
                          if (
                            !(t.body && t.body.examId && t.body.questionIdList)
                          ) {
                            e.next = 15;
                            break;
                          }
                          return (
                            Y(t.body),
                            (a = t.body),
                            (i = a.questionIdList),
                            (u = void 0 === i ? [] : i),
                            (o = a.questionNodeResp),
                            (c = void 0 === o ? [] : o),
                            (m = u.map(function(e, t) {
                              if (c.length > 0) {
                                var n = c[t];
                                return (0, r.Z)(
                                  (0, r.Z)(
                                    {},
                                    Et({ questionId: n.questionId, index: t })
                                  ),
                                  {},
                                  {
                                    questionNodesAnswer: (0, w.W$)(
                                      n.questionNodeIds
                                    )
                                  }
                                );
                              }
                              return (0,
                              r.Z)({}, Et({ questionId: e, index: t }));
                            })),
                            pe(m),
                            J(
                              m.map(function(e) {
                                return (0,
                                r.Z)((0, r.Z)({}, e), {}, { question: {} });
                              })
                            ),
                            (e.next = 15),
                            bt(t.body)
                          );
                        case 15:
                          e.next = 22;
                          break;
                        case 17:
                          return (
                            (e.prev = 17),
                            (e.t0 = e.catch(0)),
                            n.g.$message((0, O.vs)("network_anomaly")),
                            Pt(w.Bc.info),
                            e.abrupt("return")
                          );
                        case 22:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [[0, 17]]
                );
              })
            );
            return function() {
              return e.apply(this, arguments);
            };
          })(),
          wt = (function() {
            var e = (0, i.Z)(
              s().mark(function e(t) {
                var n, a, i;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.next = 2), q.Oe.queryQuestionAnswer(f, t.attemptId)
                        );
                      case 2:
                        if (!(n = e.sent)._failure) {
                          e.next = 5;
                          break;
                        }
                        return e.abrupt("return");
                      case 5:
                        return (
                          (a = n.body || []),
                          (i =
                            void 0 === Be.isTimeLimit || null === Be.isTimeLimit
                              ? 0
                              : Be.isTimeLimit),
                          pe(function(e) {
                            return e.map(function(e) {
                              var t = e.questionNodesAnswer.some(function(e) {
                                  return e.questionNodesAnswer;
                                }),
                                n = a.find(function(t) {
                                  return t.questionId === e.questionId;
                                });
                              return (0,
                              r.Z)((0, r.Z)({}, e), {}, { hasSubmit: !(!n || !t), done: qt(i, n), images: n ? n.images : [], answerList: n ? n.answerList : [], questionNodesAnswer: n && t ? (0, w.W$)(n.questionNodesAnswer) : e.questionNodesAnswer });
                            });
                          }),
                          (e.next = 10),
                          Nt(t)
                        );
                      case 10:
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
          qt = function(e, t) {
            return (
              !(
                e !== w.hn.YES ||
                !t ||
                (!t.answerList && !t.questionNodesAnswer)
              ) ||
              !!(
                e === w.hn.NO &&
                t &&
                t.answerList &&
                t.answerList.length > 0
              ) ||
                !!(
                  e === w.hn.NO &&
                  t &&
                  t.questionNodesAnswer &&
                  t.questionNodesAnswer.some(function(e) {
                    return e.answerList;
                  })
                )
            );
          },
          Nt = (function() {
            var e = (0, i.Z)(
              s().mark(function e() {
                var t,
                  n,
                  r = arguments;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (t = r.length > 0 && void 0 !== r[0] ? r[0] : W),
                          (n = [
                            Lt(t.examId, t.questionIdList, t.questionNodeResp)
                          ]),
                          $e.testType === w.kq.FORMAL &&
                            n.push(Ct(t.attemptId)),
                          (e.next = 5),
                          Promise.all(n)
                        );
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
          Lt = (function() {
            var e = (0, i.Z)(
              s().mark(function e(t, n, r) {
                var a;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (([], !(n.length > 10))) {
                          e.next = 7;
                          break;
                        }
                        return (a = _t(n)), (e.next = 5), Rt(t, a[0], r);
                      case 5:
                        e.next = 9;
                        break;
                      case 7:
                        return (e.next = 9), Rt(t, n, r);
                      case 9:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function(t, n, r) {
              return e.apply(this, arguments);
            };
          })(),
          _t = function(e) {
            var t = [];
            if (e && e.length > 10) {
              for (var n = 0; n < e.length; n += 10) t.push(e.slice(n, n + 10));
              Ve(t);
            }
            return t;
          },
          Ot = function e(t, n) {
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
          Bt = function(e, t) {
            var n = [];
            return (
              (t && t.length > 0 ? t : W.questionNodeResp).forEach(function(t) {
                e.includes(t.questionId) && Ot(t.questionNodeIds, n);
              }),
              { questionIds: e, questionNodeIds: n }
            );
          },
          Rt = (function() {
            var e = (0, i.Z)(
              s().mark(function e(t, a, i) {
                var u, o, c, m, f;
                return s().wrap(
                  function(e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (
                            (u = Bt(a, i)),
                            (o = u.questionNodeIds),
                            Se(!0),
                            (c = {}),
                            (e.prev = 3),
                            (e.next = 6),
                            q.Oe.queryQuestionDetail(t, a, o)
                          );
                        case 6:
                          (c = e.sent), Se(!1), (e.next = 15);
                          break;
                        case 10:
                          return (
                            (e.prev = 10),
                            (e.t0 = e.catch(3)),
                            Se(!1),
                            n.g.$message((0, O.vs)("get_exam_fail")),
                            e.abrupt("return", !1)
                          );
                        case 15:
                          if (!c._failure) {
                            e.next = 18;
                            break;
                          }
                          return Se(!1), e.abrupt("return", !1);
                        case 18:
                          if (
                            ((m = Be.testType),
                            (f = Be.isSectionDisorder),
                            0 !== +c.code || !c.body)
                          ) {
                            e.next = 22;
                            break;
                          }
                          return (
                            J(function(e) {
                              return e.map(function(e, t) {
                                var n = c.body.find(function(t) {
                                  return t.questionId === e.questionId;
                                });
                                if (!n) return e;
                                var a = n.questionType,
                                  s = n.newQuestionNodes,
                                  i = void 0 === s ? [] : s,
                                  u = n.sectionRespList,
                                  o = void 0 === u ? [] : u,
                                  d =
                                    a !== w.ce.FILL_IN_BLANK &&
                                    a !== w.ce.QUESTION_ANSWER &&
                                    a !== w.ce.LINE &&
                                    m === w.kq.FORMAL &&
                                    f === w.hn.YES;
                                return (0, r.Z)(
                                  (0, r.Z)({}, e),
                                  {},
                                  {
                                    question: (0, r.Z)(
                                      (0, r.Z)({}, n),
                                      {},
                                      {
                                        newQuestionNodes: i.map(function(e) {
                                          return (0,
                                          r.Z)((0, r.Z)({}, e), {}, { sectionRespList: d ? (0, I.TV)(e.sectionRespList) : e.sectionRespList });
                                        }),
                                        sectionRespList: d ? (0, I.TV)(o) : o
                                      }
                                    )
                                  }
                                );
                              });
                            }),
                            e.abrupt("return", !0)
                          );
                        case 22:
                          return e.abrupt("return", !1);
                        case 23:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [[3, 10]]
                );
              })
            );
            return function(t, n, r) {
              return e.apply(this, arguments);
            };
          })(),
          Tt = (function() {
            var e = (0, i.Z)(
              s().mark(function e(t, n, r) {
                var a, i;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if ((Ft(!0, r), H[t].question.questionText)) {
                          e.next = 10;
                          break;
                        }
                        return (
                          (a = Ue.findIndex(function(e) {
                            return e.find(function(e) {
                              return e === H[t].questionId;
                            });
                          })),
                          (i = Ue[a > -1 ? a : 0]),
                          (e.next = 6),
                          Rt(W.examId, i)
                        );
                      case 6:
                        e.sent ? At(!0, n, r, t) : (Ft(!1, r), At(!1, n, r, t)),
                          (e.next = 11);
                        break;
                      case 10:
                        At(!0, n, r, t);
                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function(t, n, r) {
              return e.apply(this, arguments);
            };
          })(),
          At = function(e, t, n, r) {
            "function" === typeof t && t(),
              e && (("up" !== n && "next" !== n) || Xe(r)),
              Ft(!1, n);
          },
          Ft = function(e, t) {
            "up" === t ? Le(e) : "next" === t && ke(e);
          },
          Ct = (function() {
            var e = (0, i.Z)(
              s().mark(function e(t) {
                var n;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (e.next = 2), q.Oe.getExamTime(f, t);
                      case 2:
                        if (!(n = e.sent)._failure) {
                          e.next = 5;
                          break;
                        }
                        return e.abrupt("return");
                      case 5:
                        G(n.body);
                      case 6:
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
          Pt = function(e) {
            _.Z.setExamStage(e), D(e);
          },
          Dt = function(e) {
            he(e);
          },
          Mt = {
            nextLoading: Ee,
            upLoading: Ne,
            questionLoading: Ie,
            setTypeLoding: Ft
          },
          Qt = (function() {
            var e = (0, i.Z)(
              s().mark(function e() {
                var t, n, r;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (t = (0, I.xG)()),
                          (n = {
                            businessType: w.$8.Exam,
                            resourceId: f,
                            userId: t.sessionInfo.userId
                          }),
                          (e.next = 4),
                          q.Oe.queryCutScreenInfo(n)
                        );
                      case 4:
                        if (0 === +(r = e.sent).code) {
                          e.next = 7;
                          break;
                        }
                        return e.abrupt("return");
                      case 7:
                        dt(r.body);
                      case 8:
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
          Wt = (function() {
            var e = (0, i.Z)(
              s().mark(function e() {
                var t, n;
                return s().wrap(function(e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (t = { os: B.dM.STR_OS, sid: R.Z.getSid() }),
                          (e.next = 3),
                          q.Oe.queryVasOperation2NativeList(t)
                        );
                      case 3:
                        if (0 === +(n = e.sent).code) {
                          e.next = 6;
                          break;
                        }
                        return e.abrupt("return");
                      case 6:
                        n.body.opertationList.some(function(e) {
                          return (
                            "OP_SCREEN_CAPTURE_CONTROL_APP" === e.operationCode
                          );
                        }) && Qt();
                      case 8:
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
        (0, o.useEffect)(
          function() {
            Be && Be.isFlipScreen && Be.isFlipScreen === w.iK.Open && Wt();
          },
          [Be]
        );
        var Yt = c().createElement(
          c().Fragment,
          null,
          P === w.Bc.info || P === w.Bc.transition
            ? c().createElement(h.Z, {
                examId: f,
                detail: Be,
                setExamStage: Pt,
                startExam: gt,
                getExamBreakInfo: yt,
                setIsFromResult: rt,
                cutScreenInfo: ft
              })
            : P === w.Bc.exam
            ? c().createElement(
                c().Fragment,
                null,
                ot &&
                  c().createElement(N.Z, {
                    camOpening: ee,
                    openCamDone: function() {
                      te(!1), It();
                    },
                    attemptId: ae,
                    examId: f,
                    setExamStage: Pt
                  }),
                !ee &&
                  c().createElement(g.Z, {
                    detail: Be,
                    setExamResultObj: ce,
                    examId: f,
                    examPaper: W,
                    answers: de,
                    questionDetails: H,
                    remainTime: j,
                    isInvigilate: ot,
                    setExamStage: Pt,
                    setExamPaper: Y,
                    setAllAnswers: pe,
                    loadingState: Mt,
                    currentIndex: Ke,
                    setCurrentIndex: Xe,
                    onChangeQuestionNo: Tt,
                    isFromResult: nt,
                    setRemainTime: G,
                    getExamBreakInfo: yt,
                    trainingItemId: y,
                    limitSize: it,
                    cutScreenInfo: ft
                  })
              )
            : P === w.Bc.result
            ? c().createElement(Z.Z, {
                setExamStage: Pt,
                examResultObj: oe,
                setIsFromResult: rt,
                detail: Be,
                getExamBreakInfo: yt,
                setRemainTime: G,
                changeLoading: Dt,
                getExamDetail: Zt,
                cutScreenInfo: ft,
                examId: f
              })
            : P === w.Bc.errorQuestions
            ? c().createElement(b.Z, {
                MAX_QUESTION_NUM: 10,
                examId: f,
                setExamStage: Pt,
                examPaper: W,
                isFromResult: nt,
                detail: Be,
                getExamBreakInfo: yt
              })
            : P === w.Bc.checkCertificate
            ? c().createElement(E.Z, {
                changeLoading: Dt,
                setExamStage: Pt,
                examId: f,
                getExamBreakInfo: yt,
                isFromResult: nt
              })
            : P === w.Bc.historyScore
            ? c().createElement(k.Z, {
                setExamStage: Pt,
                examId: f,
                detail: Be,
                getExamBreakInfo: yt
              })
            : null
        );
        return c().createElement(
          m.Z,
          {
            id: "examWatermark",
            className: "".concat(t.root, " ").concat(ot ? t.invigilateRoot : "")
          },
          c().createElement(l.Z, {
            routes: [
              { name: (0, O.vs)("home"), href: "/", id: "home/homePage" },
              {
                name: (0, O.vs)(A ? "public_exam" : "my_exam"),
                href: "/",
                id: xt
              }
            ],
            pageName: (0, O.vs)("exam_detail"),
            routeClick: function(e) {
              if (P === w.Bc.exam) n.g.$message((0, O.vs)("not_allow_quit"));
              else {
                var t = (0, I.ir)() || "";
                location.href = "".concat(t, "/znWeb/znPortal/#/").concat(e);
              }
            },
            hasClickCb: !0,
            operator:
              !ee &&
              P === w.Bc.exam &&
              c().createElement(
                "span",
                { className: t.tipsText },
                (0, O.vs)("examing_limit_tips")
              )
          }),
          c().createElement(
            "div",
            { className: "".concat(t.loading, " ").concat(ve ? "" : t.hide) },
            c().createElement(L.Z, null)
          ),
          Yt,
          c().createElement(x.Z, {
            visible: Fe,
            content: Me,
            onOk: function() {
              var t = e.history;
              Ce(!1), t.goBack();
            },
            okText: (0, O.vs)("i_got_it"),
            contentStyle: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }
          })
        );
      });
    }
  }
]);
