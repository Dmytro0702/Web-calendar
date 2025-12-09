export type CalendarDTO = {
  id: string; // идентификатор
  ownerId: string; // владелец
  name: string; // название
  color: string; // HEX
  isDefault: boolean; // дефолтный (нельзя удалить)
  isVisible: boolean; // видимость для текущего пользователя
  createdAt: string; // ISO
  updatedAt: string; // ISO
};


