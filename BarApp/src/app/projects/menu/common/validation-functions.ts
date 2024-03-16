import { Promotion } from '../promotions/models/promotion';

export function isPromotionValid(promotion: Promotion) {
  const currentDate = getCurrentDate();

  if (
    (!promotion.valid_from || !promotion.valid_to) &&
    isCurrentDayOfWeekValid(promotion)
  ) {
    return true;
  }

  if (promotion.valid_from && promotion.valid_to) {
    const validFrom = new Date(promotion.valid_from);
    const validTo = new Date(promotion.valid_to);
    if (
      currentDate >= validFrom &&
      currentDate <= validTo &&
      !hasDays(promotion)
    ) {
      return true;
    }
    return (
      currentDate >= validFrom &&
      currentDate <= validTo &&
      isCurrentDayOfWeekValid(promotion)
    );
  }

  return false;
}

export function isCurrentDayOfWeekValid(promotion: Promotion) {
  const currentDayOfWeek = new Date().getDay();
  return promotion.days_of_week?.includes(currentDayOfWeek) || false;
}

export function hasDays(promotion: Promotion) {
  return promotion.days_of_week && promotion.days_of_week.length > 0;
}

function getCurrentDate() {
  return new Date();
}
