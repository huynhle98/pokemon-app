export interface IMenuItem {
  label: string;
  path: string;
  icon?: string;
  children?: IMenuItem[];
}
