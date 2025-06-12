from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from utils.dbHandler import get_columns, get_unique_values, get_all_records, get_db

router = APIRouter()

@router.get("/columns")
def get_columns_route():
    """
    Get column mappings from the database.

    Returns:
        dict: {'columns': <mapping of internal keys to readable names>}
    """
    try:
        columns = get_columns()
        return {"columns": columns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/unique-values")
def get_unique_values_route(
    column: str = Query(..., description="Column name to fetch unique values for"),
    db: Session = Depends(get_db),
):
    """
    Get unique non-null values for a specific column.

    Parameters:
        column (str): Column name to query.
        db (Session): SQLAlchemy DB session.

    Returns:
        dict: {'values': [<list of unique values>]}
    """
    try:
        values = get_unique_values(column, db=db)
        return {"values": values}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all")
def get_all_data(
    page:  int     = Query(1, ge=1, description="Page number (1-based)"),
    limit: int     = Query(100, ge=1, description="Records per page"),
    db:    Session = Depends(get_db),
):
    """
    Get all disease records with pagination.

    Parameters:
        page (int): Page number.
        limit (int): Records per page.
        db (Session): SQLAlchemy DB session.

    Returns:
        dict: {
            'data': [...records...],
            'meta': {
                'page': <int>,
                'limit': <int>,
                'total': <int>
            }
        }
    """
    try:
        results, total = get_all_records(page, limit, db=db)
        return {
            "data": results,
            "meta": {
                "page":  page,
                "limit": limit,
                "total": total,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
