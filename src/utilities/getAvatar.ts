interface IGetAvatar {
  default(irstName: string, lastName: string): string;
}

const getAvatar: IGetAvatar = {
  default: (firstName: string, lastName: string): string => {
    return `https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&bold=true&rounded=true`;
  }
};

export default getAvatar;
