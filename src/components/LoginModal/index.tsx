import { Dispatch, ForwardedRef, SetStateAction, useContext, useRef, useState } from 'react';
import styles from './loginModal.module.scss';
import { AuthContext } from '../../App';

const LoginModal = ({
  modalRef,
  clickOutsideModal,
  setIsOpenPopup,
}: {
  modalRef: ForwardedRef<HTMLDivElement>;
  clickOutsideModal: (e: any) => void;
  setIsOpenPopup: Dispatch<SetStateAction<boolean>>;
}) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const auth = useContext(AuthContext);

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (emailRegex.test(email)) {
      setErrorMessage('');
      return true;
    }
    setErrorMessage('이메일 형식이 맞지 않습니다.');
    return false;
  };

  const signin = () => {
    if (emailRef.current && emailRef.current.value !== '') {
      const isValidate = validateEmail(emailRef.current.value);
      if (isValidate) sessionStorage.setItem('user', emailRef.current.value);
      if (sessionStorage.getItem('user')) {
        auth.setUser(sessionStorage.getItem('user'));
        setIsOpenPopup(false);
      }
    }
  };

  return (
    <div className={styles.container} ref={modalRef} onClick={(e) => clickOutsideModal(e)}>
      <div className={styles.modal}>
        <h3>로그인</h3>
        <div>
          <input type="text" placeholder="이메일" ref={emailRef} />
          {errorMessage !== '' && <p>{errorMessage}</p>}
          <button onClick={() => signin()}>로그인</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
