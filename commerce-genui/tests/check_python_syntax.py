"""
Check Python SDK for syntax errors and import issues
"""

import sys
import os
import ast
import importlib.util

# Python files to check
PYTHON_FILES = [
    "packages/core/commerce_genui/__init__.py",
    "packages/core/commerce_genui/intent_schema.py",
    "packages/core/commerce_genui/decision_engine.py",
    "packages/core/commerce_genui/registry.py",
    "packages/core/setup.py",
    "examples/minimal-shop/backend/server.py",
]


def check_syntax(filepath):
    """Check Python file for syntax errors"""
    print(f"\nChecking: {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Parse the code
        ast.parse(code)
        print(f"  ✅ Syntax OK")
        return True
        
    except SyntaxError as e:
        print(f"  ❌ SYNTAX ERROR:")
        print(f"     Line {e.lineno}: {e.msg}")
        print(f"     {e.text}")
        return False
    except FileNotFoundError:
        print(f"  ❌ FILE NOT FOUND")
        return False
    except Exception as e:
        print(f"  ❌ ERROR: {e}")
        return False


def check_imports(filepath):
    """Check if file can be imported"""
    print(f"\nTesting imports: {filepath}")
    
    try:
        spec = importlib.util.spec_from_file_location("test_module", filepath)
        if spec and spec.loader:
            module = importlib.util.module_from_spec(spec)
            sys.modules["test_module"] = module
            spec.loader.exec_module(module)
            print(f"  ✅ Imports OK")
            return True
        else:
            print(f"  ❌ Cannot load module")
            return False
            
    except ImportError as e:
        print(f"  ❌ IMPORT ERROR: {e}")
        return False
    except Exception as e:
        print(f"  ❌ ERROR: {e}")
        return False


def run_checks():
    """Run all syntax and import checks"""
    print("="*60)
    print("PYTHON SDK SYNTAX & IMPORT CHECKER")
    print("="*60)
    
    syntax_results = []
    
    for filepath in PYTHON_FILES:
        full_path = os.path.join(os.path.dirname(__file__), "..", filepath)
        
        # Check syntax
        syntax_ok = check_syntax(full_path)
        syntax_results.append((filepath, syntax_ok))
    
    # Report
    print("\n" + "="*60)
    print("RESULTS")
    print("="*60)
    
    passed = sum(1 for _, ok in syntax_results if ok)
    total = len(syntax_results)
    
    for filepath, ok in syntax_results:
        status = "✅" if ok else "❌"
        print(f"{status} {filepath}")
    
    print("\n" + "="*60)
    print(f"TOTAL: {passed}/{total} files passed")
    print("="*60)
    
    if passed == total:
        print("\n🎉 All Python files are syntactically correct!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} file(s) have errors")
        return 1


if __name__ == "__main__":
    exit_code = run_checks()
    sys.exit(exit_code)
