/* eslint-disable jsx-a11y/control-has-associated-label */
import { IUser } from 'src/interfaces';

interface Props {
  dataSource: IUser;
}

export const ProfileCard = ({ dataSource }: Props) => (
  <div>
    <div className="avatar">
      <img src={dataSource?.avatar || '/no-avatar.png'} alt="" />
    </div>
    <table>
      <tbody>
        <tr>
          <th style={{ width: 150, minWidth: 150 }} />
          <th />
        </tr>
        <tr>
          <td>Username</td>
          <td>{dataSource?.username}</td>
        </tr>
      </tbody>
    </table>
  </div>
);
