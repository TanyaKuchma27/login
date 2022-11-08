import FuseUtils from '@fuse/utils';
import { Navigate } from 'react-router-dom';

import settingsConfig from 'app/configs/settingsConfig';

import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import dashboardsConfigs from '../main/dashboards/dashboardsConfigs';

const routeConfigs = [...dashboardsConfigs, SignInConfig, SignOutConfig];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="dashboards/analytics" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];

export default routes;
