pub const ORIENTATION_COUNT: u8 = 4;

#[derive(PartialEq, Copy, Drop, Debug)]
pub enum Orientation {
    None,
    Up,
    Down,
    Left,
    Right,
}

#[generate_trait]
pub impl OrientationImpl of OrientationTrait {
    #[inline]
    fn draw(seed: u256) -> Orientation {
        (1_u8 + (seed.low % ORIENTATION_COUNT.into()).try_into().unwrap()).into()
    }
}

pub impl OrientationIntoU8 of Into<Orientation, u8> {
    #[inline]
    fn into(self: Orientation) -> u8 {
        match self {
            Orientation::None => 0,
            Orientation::Up => 1,
            Orientation::Down => 2,
            Orientation::Left => 3,
            Orientation::Right => 4,
        }
    }
}

pub impl OrientationFromU8 of Into<u8, Orientation> {
    #[inline]
    fn into(self: u8) -> Orientation {
        match self {
            0 => Orientation::None,
            1 => Orientation::Up,
            2 => Orientation::Down,
            3 => Orientation::Left,
            4 => Orientation::Right,
            _ => Orientation::None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_orientation_draw() {
        assert_eq!(OrientationImpl::draw(0), OrientationImpl::draw(ORIENTATION_COUNT.into()));
    }
}
