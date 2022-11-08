import { useEffect } from 'react';
import JwtService from '../../auth/services/jwtService';

function SignOut() {
  useEffect(() => {
    JwtService.logout();
  }, []);
}

export default SignOut;
