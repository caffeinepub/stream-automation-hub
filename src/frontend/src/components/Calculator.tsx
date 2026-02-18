import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Delete } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4 text-right">
          <div className="text-sm text-muted-foreground h-6">
            {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
          </div>
          <div className="text-3xl font-bold text-foreground break-all">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" onClick={handleClear} className="col-span-2">
            AC
          </Button>
          <Button variant="outline" onClick={handleBackspace}>
            <Delete className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={() => handleOperation('/')}>
            ÷
          </Button>

          <Button variant="outline" onClick={() => handleNumber('7')}>7</Button>
          <Button variant="outline" onClick={() => handleNumber('8')}>8</Button>
          <Button variant="outline" onClick={() => handleNumber('9')}>9</Button>
          <Button variant="secondary" onClick={() => handleOperation('*')}>
            ×
          </Button>

          <Button variant="outline" onClick={() => handleNumber('4')}>4</Button>
          <Button variant="outline" onClick={() => handleNumber('5')}>5</Button>
          <Button variant="outline" onClick={() => handleNumber('6')}>6</Button>
          <Button variant="secondary" onClick={() => handleOperation('-')}>
            −
          </Button>

          <Button variant="outline" onClick={() => handleNumber('1')}>1</Button>
          <Button variant="outline" onClick={() => handleNumber('2')}>2</Button>
          <Button variant="outline" onClick={() => handleNumber('3')}>3</Button>
          <Button variant="secondary" onClick={() => handleOperation('+')}>
            +
          </Button>

          <Button variant="outline" onClick={() => handleNumber('0')} className="col-span-2">
            0
          </Button>
          <Button variant="outline" onClick={handleDecimal}>.</Button>
          <Button variant="default" onClick={handleEquals}>
            =
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
