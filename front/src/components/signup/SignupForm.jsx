import SignupEmailHeader from "./SignupEmailHeader";
import Input from "../common/Input";
import Button from "../common/Button";
import EmailContainer from "./EmailContainer";
import Card from "../common/Card";
import CenterContainer from "../common/CenterContainer";
import NotAuthNumber from "./NotAuthNumber";

import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledP = styled.p`
  color: #f28482;
`;
const SignupForm = () => {
  const [isAuthCode, setIsAuthCode] = useState(false);
  const [authCorrect, setAuthCorrect] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const baseurl = import.meta.env.VITE_APP_BASE_URL;
  const [formData, setFormData] = useState({
    signupEmail: "",
    authNumber: "",
    // ... (다른 상태값들)
  });

  const buttonNavigate = () => {
    setUserEmail(formData.email);
    navigate("/signupPw", {
      state: {
        userEmail: userEmail,
      },
    });
  };

  const alertMessage = () => {
    alert("인증번호가 올바르지 않습니다!");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAuthRequest = async () => {
    const baseurl = import.meta.env.VITE_APP_BASE_URL;

    try {
      // 서버에 인증 요청을 보냅니다.
      // await axios.post('http://i10c106.p.ssafy.io:8080/v1/email/join-code', {
      await axios.post(baseurl + "email/join-code", {
        email: formData.signupEmail,
        // ... (다른 필요한 데이터)
      });
      setIsAuthCode(true);

      // TODO: 응답에 따른 처리 로직 작성
      alert("인증번호가 요청되었습니다");
    } catch (error) {
      alert("올바르지 않은 이메일 형식입니다");
    }
  };

  useEffect(() => {
    const handleAuthChange = async (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
      try {
        await axios.post(`${baseurl}email/confirm`, {
          email: formData.signupEmail,
          code: e.target.value,
        })
        setAuthCorrect(true);
        setUserEmail(formData.signupEmail);
      } catch (error) {
        setAuthCorrect(false);
      }
    }
    const timer = setTimeout(() => {
      handleAuthChange();
    }, 5000);

    return () => clearTimeout(timer);

  }, [codeInput])

  // const handleAuthChange = async (e) => {
  //   setFormData({ ...formData, [e.target.id]: e.target.value });
  //   try {
  //     await axios.post(`${baseurl}email/confirm`, {
  //       email: formData.signupEmail,
  //       code: e.target.value,
  //     });
  //     setAuthCorrect(true);
  //     setUserEmail(formData.signupEmail);
  //   } catch (error) {
  //     setAuthCorrect(false);
  //   }
  // };

  useEffect(() => {
    setUserEmail(formData.signupEmail);
  }, [authCorrect]);

  return (
    <Card>
      {/* 회원가입 이메일 */}
      <SignupEmailHeader />
      <EmailContainer>
        <Input
          htmlFor="signupEmail"
          width="250px"
          id="signupEmail"
          placeholder="이메일 입력"
          value={formData.signupEmail}
          onChange={handleInputChange}
          disabled={authCorrect}
        />
        <Button width="25%" onClick={handleAuthRequest}>
          인증 요청
        </Button>
      </EmailContainer>
      {/* 위에 있는 인증 요청 버튼을 누른 순간 생성됨 */}
      {isAuthCode && (
        <>
          <Input htmlFor="authNumber" id="authNumber" placeholder="인증번호" value={formData.authNumber} onChange={() => setCodeInput((value) => value)} disabled={authCorrect} />
          {!authCorrect && <p>✓ 인증 번호가 같아요</p>}
          {authCorrect && <StyledP>✓ 인증 번호가 같아요</StyledP>}
          <NotAuthNumber>인증번호가 오지 않아요.</NotAuthNumber>
        </>
      )}

      <CenterContainer>
        {authCorrect && (
          <Button width="40%" marginTop="50px" onClick={buttonNavigate}>
            다음
          </Button>
        )}
        {!authCorrect && (
          <Button width="40%" marginTop="50px" background-color="#B1B1B1" borderColor="#B1B1B1" onClick={alertMessage}>
            다음
          </Button>
        )}
      </CenterContainer>
    </Card>
  );
};

export default SignupForm;
