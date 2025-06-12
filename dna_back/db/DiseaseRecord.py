from sqlalchemy import Column, BigInteger, Text, Float, Index
from utils.database import Base

class DiseaseRecord(Base):
    __tablename__ = 'disease_records'
    
    ID           = Column(BigInteger, primary_key=True, index=True)
    CHROM        = Column(Text)
    POS          = Column(BigInteger)
    REF          = Column(Text)
    ALT          = Column(Text)
    CLNSIG       = Column(Text)
    GENEINFO     = Column(Text)
    CLNVC        = Column(Text)
    CLNVCSO      = Column(Text)
    CLNDN        = Column(Text)
    ALT_TYPE     = Column(Text)
    ALT_VALUE    = Column(Text)
    NormalSeq    = Column(Text)
    MUTATED_SEQ  = Column(Text)
    Category     = Column(Text)
    ORIGIN       = Column(Float)
