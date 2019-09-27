import { act, renderHook } from '@testing-library/react-hooks';
import useCount from './useCount';

const setUp = () => renderHook(() => useCount());

describe('useToggle', () => {
  it('should init state to 0', () => {
    const { result } = setUp();

    expect(result.current[0]).toBe(0);
    expect(typeof result.current[1]).toBe('function');
  });

  it('should set count to 1', () => {
    const { result } = setUp();
    const [, count] = result.current;

    expect(result.current[0]).toBe(0);

    act(() => {
      count();
    });

    expect(result.current[0]).toBe(1);
  });
});
