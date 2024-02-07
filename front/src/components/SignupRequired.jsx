import Card from "./common/Card";
import SignupRequiredHeader from "./signup/SignupRequiredHeader";
import LabelStyle from "./signup/LabelStyle";
import Input from "./common/Input";
import LabelContainer from "./signup/LabelContainer";
import LabelSignup from "./signup/LabelSignup";
import RadioLabelText from "./signup/RadioLabelText";
import CenterContainer from "./common/CenterContainer";
import Button from "./common/Button";

const SignupRequired = () => {
  return (
    <Card>
      <SignupRequiredHeader />
      <form action="#">
        <LabelStyle htmlFor="name">* 이름</LabelStyle>
        <Input id="name" placeholder="이름 입력" required />

        <LabelStyle htmlFor="nickname">* 닉네임</LabelStyle>
        <Input id="nickname" placeholder="닉네임 입력" required />
        
        <LabelStyle htmlFor="birth">* 생년월일</LabelStyle>
        <Input id="birth" placeholder="8자리 Ex) 19990118" required />
        
        <LabelStyle htmlFor="gender" required>* 성별</LabelStyle>   
        <LabelContainer>
          <LabelSignup htmlFor="male" >
            <Input
              id="male" name="gender"
              type="radio" width="1"
            />
            <RadioLabelText>여성</RadioLabelText>
          </LabelSignup>
          <LabelSignup htmlFor="female">
            <Input width="1" id="female" name="gender" type="radio" />
            <RadioLabelText>남성</RadioLabelText>
          </LabelSignup>
        </LabelContainer>
        <CenterContainer>
          <Button width="40%">완료</Button>
        </CenterContainer>
      </form>
    </Card>
  );
};

export default SignupRequired