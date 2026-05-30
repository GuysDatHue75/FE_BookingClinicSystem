import { useState, useEffect, useRef, useCallback } from "react";
import patientsData from "./../../../../data/OnlineConsult.json";
import "./OnlineConsult.css";
import waitingMp3 from "../../../../assets/ring/cho.mp3";
import incomingMp3 from "../../../../assets/ring/den.mp3";
import avtUsers from "../../../../assets/image/user-avt.png"
import apiClient from "../../../../api/api";

const OnlineConsult = () => {
  const [video, setVideo] = useState(true);
  const [mic, setMic] = useState(true);
  const role = localStorage.getItem("role");
  const [userId, setUserId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [callDocterData, setCallDocterData] = useState([]);

  const [callState, setCallState] = useState("idle");
  const id = localStorage.getItem("idDoctor");

  const [incomingCallInfo, setIncomingCallInfo] = useState(null);
  const [callingName, setCallingName] = useState("");
  const [incomingName, setIncomingName] = useState("");

  const clientRef = useRef(null);
  const callRef = useRef(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const callingAudioRef = useRef(
    typeof Audio !== "undefined" ? new Audio(waitingMp3) : null
  );

  const ringingAudioRef = useRef(
    typeof Audio !== "undefined" ? new Audio(incomingMp3) : null
  );

  useEffect(() => {
    const getListCallDoctor = async () => {
      const res = await apiClient.get(`/api/v1/calendar-dt/today?maBacSi=${localStorage.getItem("idDoctor")}`);
      console.log(res.data);
      
      setCallDocterData(res.data);
    }

    getListCallDoctor();
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 });

    if (id) {
      setUserId(id);
      connectStringee(id);
    }

    return () => {
      destroyAll();
    };
  }, []);

  const safePlayAudio = async (audio) => {
    try {
      if (!audio) return;
      audio.currentTime = 0;
      await audio.play();
    } catch (e) {
      console.warn("Audio blocked:", e);
    }
  };

  const stopAllSounds = () => {
    [callingAudioRef.current, ringingAudioRef.current].forEach((a) => {
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    });
  };


  const attachRemoteStream = async (stream) => {
    try {
      remoteStreamRef.current = stream;

      const video = remoteVideoRef.current;
      if (!video) return;

      video.srcObject = stream;
      video.muted = false;
      video.volume = 1;

      const p = video.play();
      if (p) await p;
    } catch (e) {
      console.warn("Remote play fail:", e);
    }
  };

  const attachLocalStream = async (stream) => {
    try {
      localStreamRef.current = stream;

      const video = localVideoRef.current;
      if (!video) return;

      video.srcObject = stream;
      video.muted = true;

      const p = video.play();
      if (p) await p;
    } catch (e) {
      console.warn("Local play fail:", e);
    }
  };

  /** =========================
   * CLEANUP
   * ========================= */
  const stopTracks = (stream) => {
    try {
      if (!stream) return;

      stream.getTracks().forEach((track) => track.stop());
    } catch { }
  };

  const clearVideos = () => {
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  const resetUI = useCallback(() => {
    stopAllSounds();

    setCallState("idle");
    setCallingName("");
    setIncomingName("");

    setMic(true);
    setVideo(true);

    stopTracks(localStreamRef.current);
    stopTracks(remoteStreamRef.current);

    localStreamRef.current = null;
    remoteStreamRef.current = null;

    callRef.current = null;

    clearVideos();
  }, []);

  const destroyAll = () => {
    try {
      stopAllSounds();

      if (callRef.current) {
        try {
          callRef.current.hangup(() => { });
        } catch { }
      }

      if (clientRef.current) {
        try {
          clientRef.current.disconnect();
        } catch { }
      }

      resetUI();
    } catch { }
  };

  /** =========================
   * CONNECT STRINGEE
   * ========================= */
  const connectStringee = async (currentUserId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/stringee/token?userId=${currentUserId}`
      );

      const data = await res.json();

      const client = new window.StringeeClient();

      clientRef.current = client;

      client.on("connect", () => {
        console.log("Connected");
        setIsConnected(true);
      });

      client.on("disconnect", () => {
        console.log("Disconnected");
        setIsConnected(false);
      });

      client.on("authen", (res) => {
        console.log("Auth:", res);
      });

      client.on("incomingcall", async (call) => {
        console.log("Incoming call");

        if (callRef.current) {
          call.reject(() => { });
          return;
        }

        callRef.current = call;
        setIncomingCallInfo(call);
        setCallState("ringing");

        try {
          const patientId = String(call.fromNumber || call.callerId);

          const patient = callDocterData.find(
            (item) =>
              String(item.patient.maBenhNhan) === patientId
          );
          if (patient) {
            setIncomingName(patient.patient.taiKhoan.hoVaTen);
          } else {
            setIncomingName("Bệnh nhân");
          }
        } catch (err) {
          console.log(err);
          setIncomingName("Bệnh nhân");
        }

        bindCallEvents(call);

        if (ringingAudioRef.current) {
          ringingAudioRef.current.loop = true;
          safePlayAudio(ringingAudioRef.current);
        }
      });

      client.connect(data.access_token);
    } catch (e) {
      console.error("Connect fail:", e);
    }
  };

  /** =========================
   * CALL EVENTS
   * ========================= */
  const bindCallEvents = (call) => {
    call.on("addlocalstream", (stream) => {
      console.log("Local stream");

      attachLocalStream(stream);
    });

    call.on("addremotestream", (stream) => {
      console.log("Remote stream");

      console.log("Audio tracks:", stream.getAudioTracks());
      console.log("Video tracks:", stream.getVideoTracks());

      attachRemoteStream(stream);
    });

    call.on("signalingstate", (state) => {
      console.log("Signal:", state);

      if (state.code === 3) {
        stopAllSounds();
        setCallState("accepted");
      }

      if ([4, 5, 6].includes(state.code)) {
        endCallUI();
      }
    });

    call.on("mediastate", (state) => {
      console.log("Media:", state);
    });

    call.on("error", (err) => {
      console.log("Call error:", err);
      endCallUI();
    });
  };

  /** =========================
   * MAKE CALL
   * ========================= */
  const handleCallDoctor = async (item) => {
    if (!isConnected) return alert("Chưa kết nối");
    if (callState !== "idle") return;

    setCallingName(item.patient.taiKhoan.hoVaTen);

    const call = new window.StringeeCall(
      clientRef.current,
      id,
      item.patient.maBenhNhan,
      true
    );

    callRef.current = call;

    bindCallEvents(call);

    call.makeCall((res) => {
      console.log("Make call:", res);

      if (res.message === "SUCCESS") {
        setCallState("calling");

        if (callingAudioRef.current) {
          callingAudioRef.current.loop = true;
          safePlayAudio(callingAudioRef.current);
        }
      }
    });
  };

  /** =========================
   * ACCEPT
   * ========================= */
  const acceptCall = () => {
    if (!callRef.current) return;

    stopAllSounds();

    callRef.current.answer((res) => {
      console.log("Answer:", res);

      if (res.r === 0) {
        setCallState("accepted");
      }
    });
  };

  /** =========================
   * END
   * ========================= */
  const endCall = () => {
    try {
      if (!callRef.current) {
        endCallUI();
        return;
      }

      if (callState === "ringing") {
        callRef.current.reject(() => endCallUI());
      } else {
        callRef.current.hangup(() => endCallUI());
      }
    } catch {
      endCallUI();
    }
  };

  const endCallUI = () => {
    stopAllSounds();

    setCallState("ended");

    stopTracks(localStreamRef.current);
    stopTracks(remoteStreamRef.current);

    clearVideos();

    setTimeout(() => {
      resetUI();
    }, 1500);
  };

  /** =========================
   * TOGGLE CAM
   * ========================= */
  const toggleCamUI = () => {
    const next = !video;
    setVideo(next);

    try {
      if (callRef.current?.enableLocalVideo) {
        callRef.current.enableLocalVideo(next);
      }
    } catch { }
  };

  /** =========================
   * TOGGLE MIC
   * ========================= */
  const toggleMicUI = () => {
    const next = !mic;
    setMic(next);

    try {
      if (callRef.current?.mute) {
        callRef.current.mute(!next);
      }
    } catch { }
  };


  return (
    <div className="container-calldocter-DT">
      {!isConnected && (
        <div
          style={{
            width: "100%",
            padding: 10,
            background: "#ffebee",
            color: "red",
            textAlign: "center",
          }}
        >
          Đang kết nối tổng đài...
        </div>
      )}

      <div className="wrapper-calldocter-DT">
        <h3 className="title-callDocter">Lịch khám hôm nay</h3>
        {callDocterData.filter(item => item.loaiKham === "Online" &&
          item.ngayKham === today).map((item) => (
            item.loaiKham == "Online" &&
            <div
              className="item-calldocter-DT"
              key={item.maLichKham}
              onClick={() => handleCallDoctor(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="wrapper-activiti-calldocter">
                <img
                  className="image-calldocter"
                  src={item.patient.taiKhoan.anhDaiDien || avtUsers}
                  alt={item.patient.taiKhoan.hoVaTen}
                />
              </div>

              <div className="infor-calldocter">
                <div className="name-hour-calldocter">
                  <p className="name-calldocter-DT">{item.patient.taiKhoan.hoVaTen}</p>
                </div>

                <p className="clinic-calldocter-DT">{item.doctorSchedule.khungGio}</p>
                <p className="clinic-calldocter-DT">{item?.patient?.soDienThoai}</p>

              </div>
            </div>
          )
          )}
      </div>

      <div className="main-calldocter">
        <div
          className="screen-calldocter"
          style={{
            position: "relative",
            background: "#fff",
            overflow: "hidden",
            minHeight: 350,
          }}
        >
          {callState === "idle" && (
            <h3
              style={{
                color: "#999",
                textAlign: "center",
                paddingTop: 120,
              }}
            >
              Chọn bác sĩ để bắt đầu cuộc gọi
            </h3>
          )}

          {callState === "calling" && (
            <div className="popupStyle">
                <p><span>Đang gọi bệnh nhân</span> {callingName}...</p>

                <button
                  onClick={endCall}
                  className="redBtn"
                >
                  <i className="fa-solid fa-phone-slash"></i>
                </button>
              </div>
          )}

          {callState === "ended" && (
            <h3 style={centerText}>Cuộc gọi kết thúc</h3>
          )}

          {callState === "ringing" && (
            <div className="popupStyle">
              <h3 style={{ marginLeft: "10px" }}>
                Bệnh nhân {incomingName} đang gọi cho bạn...
              </h3>
              <div style={{ display: "flex", gap: 10, marginRight: "10px" }}>
                <button
                  onClick={acceptCall}
                  className="greenBtn"
                >
                  <i class="fa-solid fa-phone"></i>
                </button>

                <button
                  onClick={endCall}
                  className="redBtn"
                >
                  <i class="fa-solid fa-x"></i>
                </button>
              </div>
            </div>
          )}

          {/* remote */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            controls={false}
            muted={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display:
                callState === "accepted" ? "block" : "none",
            }}
          />

          {/* local */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              width: 180,
              height: 220,
              borderRadius: 12,
              objectFit: "cover",
              background: "#333",
              display:
                callState !== "idle" ? "block" : "none",
            }}
          />
        </div>

        <div className="wrapper-action-calldocter">
          <p
            className="video-calldocter"
            onClick={toggleCamUI}
            style={{ cursor: "pointer" }}
          >
            {video ? (
              <i className="fa-solid fa-video"></i>
            ) : (
              <i className="fa-solid fa-video-slash"></i>
            )}
          </p>

          <p
            className="mic-calldocter"
            onClick={toggleMicUI}
            style={{ cursor: "pointer" }}
          >
            {mic ? (
              <i className="fa-solid fa-microphone"></i>
            ) : (
              <i className="fa-solid fa-microphone-slash"></i>
            )}
          </p>            <p
            className="control-calldocter"
            onClick={endCall}
            style={{
              cursor: "pointer",
              background:
                callState !== "idle" ? "red" : "",
              color:
                callState !== "idle" ? "#fff" : "",
            }}
          >
            <i className="fa-solid fa-phone"></i>
          </p>
        </div>
      </div>
    </div>


  );
};

const centerText = {
  color: "#fff",
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 10,
};


export default OnlineConsult;
