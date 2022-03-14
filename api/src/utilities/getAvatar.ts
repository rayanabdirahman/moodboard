interface IGetAvatar {
  default(name: string): string;
}

const getAvatar: IGetAvatar = {
  default: (name: string): string => {
    return `https://eu.ui-avatars.com/api/?name=${name.split(
      ' '
    )}&background=random&bold=true&rounded=true`;
  }
};

export default getAvatar;
